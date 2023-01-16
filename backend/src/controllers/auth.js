const User = require('../models/user');
const Referral = require("../models/referral")
const Token = require('../models/token');
const { sendEmail } = require('../utils/index');
const { registerEmailTemplate } = require('../utils/emailtemplates/register');
const { loginInfoEmailTemplate } = require('../utils/emailtemplates/loginInformation');
const Account = require('../models/account');
const Currency = require('../models/currency');
const FiatCurrency = require('../models/fiatCurrency');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Role = require('../models/role');
// const twofactor = require("node-2fa");
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

exports.register = async (req, res) => {
    try {
        let data = req.body
        const { email, refCount, refererId } = data;
        let checkusername = await User.findOne({ username: data.username });
        if (checkusername) return res.status(401).send({ message: 'The username already exist.' });
        const user = await User.findOne({ email });
        if (user) return res.status(401).send({ message: 'The email address already exist.' });

        const newUser = new User({ ...data });
        const newRef = new Referral({ userId: newUser._id });

        if (refererId) {
            newRef.refererId = ObjectId(refererId)
            const refFound = await Referral.findOne({ 'refererId': ObjectId(refererId) });
            if (!refFound) {
                return res.status(404).send({ message: 'Referer Code Not Found!' });
            }
        }

        // if (refererId) {
        //     newRef.refererId = ObjectId(refererId)
        // }

        if (refCount >= 0) {
            if (refCount >= 0 && refCount <= 2) {
                if (refCount == 0) {
                    newRef.userType = "Master"
                    // newRef.code = hexgen(128);
                    newRef.refCount = refCount
                } else if (data.refCount == 1) {
                    // newRef.code = hexgen(128);
                    newRef.userType = "Partner"
                    newRef.refCount = refCount
                }
                else if (data.refCount == 2) {
                    newRef.userType = "Slave"
                    newRef.refCount = refCount
                }
            }
        }

        if (data?.clientType == 3) {
            const token = await newUser.generateAffiliateJWT();
            newUser.affialiateToken = token;
        }

        const userRole = await Role.findOne({ name: 'Master' }, '_id');
        if (!data.roleId) {
            newUser.roleId = userRole._id;
        }
        const currencies = await Currency.find({});
        var currency_amounts = [];
        currencies.forEach(async (item, index) => {
            currency_amounts.push({ currencyId: item._id, amount: "0", futures_amount: '0' });
        });

        const fiatCurrencies = await FiatCurrency.find({});
        var fiat_currency_amounts = [];
        fiatCurrencies.forEach(async (item, index) => {
            fiat_currency_amounts.push({ fiatCurrencyId: item._id, amount: "0" });
        });

        // const newSecret = twofactor.generateSecret({ name: "ORBTX App", account: data.username });
        const secret = authenticator.generateSecret();
        const qr = await QRGenerate(data.email, secret);

        const newAccount = new Account({ userId: newUser._id, name: newUser.username + "'s-account", amounts: currency_amounts, fiatAmounts: fiat_currency_amounts });
        newUser.secret = secret;
        newUser.qrCode = qr;

        if ( data?.defaultManager ) {
            newUser.defaultManager = data?.defaultManager;
        }

        account_ = await newAccount.save();
        referral = await newRef.save()
        const user_ = await newUser.save();
        if (user_.isVerified) {
            return res.status(200).json({
                success: true,
                message: 'User has been created successfully.'
            });
        }
        else {
            await sendVerificationEmail(user_, req, res);
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};
exports.registerSubadmin = async (req, res) => {
    try {
        let data = req.body
        const { email, refCount, refererId, username } = data;
        const user = await User.findOne({ email });
        const checkusername = await User.findOne({ username });
        if (checkusername) return res.status(401).send({ message: 'The username address already exist.' });
        if (user) return res.status(401).send({ message: 'The email address already exist.' });
        const newUser = new User({ ...data });
        newUser.isVerified = true;
        newUser.status = true;

        if (data?.clientType == 3) {
            const token = await newUser.generateAffiliateJWT();
            newUser.affialiateToken = token;
        }

        const userRole = await Role.findOne({ name: 'Sub Admin' }, '_id');
        if (!data.roleId) {
            newUser.roleId = userRole._id;
        }

        const currencies = await Currency.find({});
        var currency_amounts = [];
        currencies.forEach(async (item, index) => {
            currency_amounts.push({ currencyId: item._id, amount: "0", futures_amount: '0' });
        });

        const fiatCurrencies = await FiatCurrency.find({});
        var fiat_currency_amounts = [];
        fiatCurrencies.forEach(async (item, index) => {
            fiat_currency_amounts.push({ fiatCurrencyId: item._id, amount: "0" });
        });

        const newAccount = new Account({ userId: newUser._id, name: newUser.username + "-s-account", amounts: currency_amounts, fiatAmounts: fiat_currency_amounts });
        const account_ = await newAccount.save();
        await newUser.save();
        let userData = { ...newUser._doc }
        return res.status(200).json({ success: true, user: userData, message: 'Sub Admin created successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, pincode, currentBrowser, currentOS, location } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(403).send({ success: false, message: 'Email not found.' });
        const adminRole = await Role.findOne({ name: 'Admin' }, '_id');
        const subAdminRole = await Role.findOne({ name: 'Sub Admin' }, '_id');
        if (adminRole._id.toString() == user.roleId.toString() || subAdminRole._id.toString() == user.roleId.toString()) {
            return res.status(403).send({ success: false, message: 'User not found.' });
        }
        if (!user.comparePassword(password))
            return res.status(403).send({ success: false, message: 'Invalid email or password' });
        // To enable user verification check
        if (!user.isVerified)
            return res.status(200).json({ type: 'not-verified', message: 'Your account has not been verified.', url: '/login?status=403&message=Your account has not been verified. Please, click on "Resend Token" button to resend verification link.&resend=' + user.email });
        if (!user.status)
            return res.status(403).json({ type: 'blocked', message: 'Your account has been blocked.' });
        const userData = await Referral.aggregate([
            {
                $match: {
                    userId: ObjectId(user._id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: '$users' }
        ])
        // Login successful, write token, and send back user
        if (!pincode) {
            if (user.otpStatus) {
                res.status(200).send({ success: false, needPinCode: true, user: userData });
            }
            else {
                user.lastLoginAt = new Date(Date.now());
                user.isLogin = true;
                await user.save();
                let subject = "Login Information";
                let to = user.email;
                let from = process.env.FROM_EMAIL;
                let fullName = user.firstName + ' ' + user.lastName;
                let link = process.env.SITE_URL + "/change-password";
                let html = loginInfoEmailTemplate(link, fullName, currentBrowser, currentOS, location);
                await sendEmail({ to, from, subject, html });
                res.status(200).send({ success: true, needPinCode: false, token: user.generateJWT(), user: userData });
            }
        }
        else {
            // check pin matched
            const { secret } = user;
            if (!authenticator.check(pincode, secret)) {
                return res.status(401).send({ success: false, message: 'Invalid 2FA Code.', needPinCode: true, user: userData });
            } else {
                user.lastLoginAt = new Date(Date.now());
                user.isLogin = true;
                await user.save();
                let subject = "Login Information";
                let to = user.email;
                let from = process.env.FROM_EMAIL;
                let fullName = user.firstName + ' ' + user.lastName;
                let link = process.env.SITE_URL + "/change-password";
                let html = loginInfoEmailTemplate(link, fullName, currentBrowser, currentOS, location);
                await sendEmail({ to, from, subject, html });
                res.status(200).send({ success: true, needPinCode: false, token: user.generateJWT(), user: userData });
            }
        }

    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
};

// Direct User Login By Admin
exports.userLogiByAdmin = async (req, res) => {
    try {
        const { email, userByAdmin } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(403).send({ success: false, message: 'Email not found.' });
        const adminRole = await Role.findOne({ name: 'Admin' }, '_id');
        const subAdminRole = await Role.findOne({ name: 'Sub Admin' }, '_id');
        if (adminRole._id.toString() == user.roleId.toString() || subAdminRole._id.toString() == user.roleId.toString()) {
            return res.status(403).send({ success: false, message: 'User is admin' });
        }

        const userData = await Referral.aggregate([
            {
                $match: {
                    userId: ObjectId(user._id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: '$users' }
        ])

        if (userByAdmin) {
            return res.status(200).send({ success: true, needPinCode: false, token: user.generateJWT(), user: userData });
        }


    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
};

// User Monitored by Affiliate
exports.affUserMonitor = async (req, res) => {
    try {
        const otl = req.params.otl;

        if (!otl)
            return res.status(403).send({ status: 400, success: false, message: 'FORBIDDEN' });
        const user = await User.findOne({ _id: ObjectId(otl) });
        if (!user)
            return res.status(403).send({ status: 400, success: false, message: 'FORBIDDEN' });
        const adminRole = await Role.findOne({ name: 'Admin' }, '_id');
        const subAdminRole = await Role.findOne({ name: 'Sub Admin' }, '_id');
        if (adminRole._id.toString() == user.roleId.toString() || subAdminRole._id.toString() == user.roleId.toString()) {
            return res.status(403).send({ status: 400, success: false, message: 'FORBIDDEN' });
        }

        // const userData = await Referral.aggregate([
        //     {
        //         $match: {
        //             userId: ObjectId(user._id)
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'userId',
        //             foreignField: '_id',
        //             as: 'users'
        //         }
        //     },
        //     { $unwind: '$users' }
        // ])

        if (otl) {
            return res.status(200).send({ success: true, needPinCode: false, token: user.generateJWT(), user: user });
        }


    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const userRole = await Role.findById(user.roleId);

        if (userRole.name == "Master" || userRole.name == "Partner" || userRole.name == "Slave") {
            return res.status(403).send({ success: false, message: 'Forbidden.' });
        }

        if (!user)
            return res.status(403).send({ success: false, message: 'Email not found.' });
        // const slaveRole = await Role.findOne({ name: 'Admin' }, '_id');
        // if (slaveRole._id.toString() == user.roleId.toString()) {
        //     return res.status(403).send({ success: false, message: 'Admin not found.' });
        // }
        if (!user.comparePassword(password))
            return res.status(403).send({ success: false, message: 'Invalid email or password' });
        // To enable user verification check
        if (!user.isVerified)
            return res.status(403).json({ type: 'not-verified', message: 'Your account has not been verified.' });
        if (!user.status)
            return res.status(403).json({ type: 'blocked', message: 'Your account has been blocked.' });
        // Login successful, write token, and send back user
        user.lastLoginAt = new Date(Date.now());
        user.isLogin = true;
        await user.save();
        res.status(200).send({ success: true, token: user.generateJWT(), user: user });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: 'Email not found.' });
        if (!user.comparePassword(password)) return res.status(401).json({ message: 'Invalid email or password' });
        user.password = newPassword
        user.save();
        res.status(200).json({ token: user.generateJWT(), user: user });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.verify = async (req, res) => {
    if (!req.params.token)
        return res.redirect(process.env.SITE_URL + '/login?status=400&message=We were unable to find a user for this token.');

    try {
        // Find a matching token
        const token = await Token.findOne({ token: req.params.token });

        if (!token)
            return res.redirect(process.env.SITE_URL + '/login?status=400&message=We were unable to find a valid token. Your token my have expired.');

        // If we found a token, find a matching user
        User.findOne({ _id: token.userId }, async (err, user) => {
            if (!user)
                return res.redirect(process.env.SITE_URL + '/login?status=400&message=We were unable to find a user for this token.');

            if (token.tokenExpiresIn < Date.now())
                return res.redirect(process.env.SITE_URL + '/login?status=400&message=We were unable to find a valid token. Your token my have expired.&resend=' + user.email);

            if (user.isVerified) {
                await Token.deleteMany({ userId: ObjectId(user._id) }); // Delete user related tokens once user is verified.
                return res.redirect(process.env.SITE_URL + '/login?status=200&message=This user has already been verified.');
            }

            // Verify and save the user
            user.isVerified = true;
            user.status = true;
            user.save(async function (err) {
                if (err)
                    return res.redirect(process.env.SITE_URL + '/login?status=500&message=' + err.message);

                await Token.deleteMany({ userId: ObjectId(user._id) }); // Delete user related tokens once user is verified.
                res.redirect(process.env.SITE_URL + '/login?status=200&message=The account has been verified. Please log in');
            });
        });
    } catch (error) {
        res.redirect(process.env.SITE_URL + '/login?status=500&message=' + error.message);
    }
};

exports.resendToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

        if (user.isVerified) return res.status(400).json({ message: 'This account has already been verified. Please log in.' });

        await sendVerificationEmail(user, req, res);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

async function sendVerificationEmail(user, req, res) {
    try {
        const token = user.generateVerificationToken();
        // Save the verification token
        await token.save();
        let subject = "Account Verification Token";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let link = process.env.BASE_URL + "/api/auth/verify/" + token.token;
        let html = registerEmailTemplate(link);
        // let html = '<p>Hi ' + user.firstName + ' ' + user.lastName + ' <p><br><p>Please click on the following <a href="' + link + '">link</a> to verify your account.</p><br><p>If you did not request this, please ignore this email.</p>';
        await sendEmail({ to, from, subject, html });
        return res.status(200).json({
            success: true,
            message: 'A verification email has been sent to ' + user.email + '.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const QRGenerate = (email, secret) => {
    return QRCode.toDataURL(
        authenticator.keyuri(email, 'OBTX 2FA', secret)
    )
}

/**
* update user login flag false
*/
exports.userLogoutActivity = async (req, res) => {
    try {
        const update = { isLogin: false };
        await User.findByIdAndUpdate(new ObjectId(req.params.userId), update, {
            new: true
        });

        return res.status(200).json({ message: 'request updated!' });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
};