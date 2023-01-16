const User = require('../models/user');
const Role = require('../models/role');
const Referral = require('../models/referral');
const InternalOrderHistory = require('../models/internalOrderHistory');
const { sendEmail } = require('../utils/index');
const { depositEmailTemplate } = require('../utils/emailtemplates/deposit');
const Token = require('../models/token');
const { default: mongoose } = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const Wallet = require('../models/wallet');
const Currency = require('../models/currency');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const ExternalTransaction = require('../models/externalTransaction');
const BankAccount = require('../models/bankAccount');
const CreditCard = require('../models/creditCard');
const { authenticator } = require('otplib');
const leverageOrder = require('../models/leverageOrder');
const FiatCurrency = require('../models/fiatCurrency');
const Country = require('../models/country');
const QRCode = require('qrcode');
const csv = require('csvtojson');
const readXlsxFile = require('read-excel-file/node');
const { Parser } = require('json2csv');
const { appendFileSync } = require('fs');
const fs = require('fs');
//const const notification = require('../../_helpers/helper')
const PermissionsModule =  require('../models/permissionsModule')
const Permission = require('../models/permission')
const notificationHelper = require('../../_helpers/helper')

var siteURL = process.env.SITE_URL;
var baseURL = process.env.BASE_URL;
const ObjectId = mongoose.Types.ObjectId;

// const ethNetwork = 'https://mainnet.infura.io/v3/584de1617d454c9d83afb36a249a1942'; // Mainnnet

// @route GET admin/user
// @desc Returns all users
// @access Public
exports.index = async function (req, res) {
    const users = await Referral.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            },
        },
        { $unwind: '$users' },
        {
            $match: {
                "users.isDeleted": false
            }
        },
    ])
    const response = users.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    });
    res.status(200).json({ response });
};

// @route POST api/user/add
// @desc Add a new user
// @access Public
exports.store = async (req, res) => {
    try {
        const { email } = req.body;
        // Make sure this account doesn't already exist
        const user = await User.findOne({ email });
        if (user) return res.status(401).json({ message: 'The email address you have entered is already associated with another account. You can change this users role instead.' });
        const password = '_' + Math.random().toString(36).substr(2, 9); //generate a random password
        const newUser = new User({ ...req.body, password, email });
        if (req.body.roleId) {
            newUser.roleId = req.body.roleId
        }
        //Generate and set password reset token
        newUser.generatePasswordReset();
        const newUserRecord = await newUser.save();
        res.json(newUserRecord);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        // const user = await User.findOne({ '_id': id });
        const user = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'countries',
                    localField: 'countryCode',
                    foreignField: 'iso',
                    as: 'country',
                    pipeline: [
                        {
                            $project: {
                                nicename: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: "$country",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $limit: 1
            }
        ])
        if (!user) return res.status(401).json({ message: 'User does not exist' });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.analytics = async function (req, res) {
    try {
        const id = req.params.id;
        let userAnalytics = {
            firstDeposit: false,
            bankOrCardWithdrawalAccount: false,
        };
        const deposits = await ExternalTransaction.findOne({ userId: id, transactionType: { $ne: true } });
        const adminDeposits = await Transaction.findOne({ userId: id, transactionType: { $ne: true } });
        const bankAcc = await BankAccount.findOne({ userId: id });
        const creditCardAcc = await CreditCard.findOne({ userId: id });

        if (deposits || adminDeposits) {
            userAnalytics.firstDeposit = true;
        }

        if (bankAcc || creditCardAcc) {
            userAnalytics.bankOrCardWithdrawalAccount = true;
        }

        return res.status(200).json({ message: 'User Analytics', userAnalytics });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.singleSubAdmin = async function (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: ObjectId(id) })
        if (!user) return res.status(401).json({ message: 'User does not exist' });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};
// @route PUT api/user/{id}
// @desc Update user details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        var unset = {};
        if (req.file) {
            update.profileImage = req.file.filename;
        }
        if (update.salesStatusId === null) {
            delete update.salesStatusId;
            unset.salesStatusId = "";
        }

        const id = req.params.id;
        const getUser = await User.findById(ObjectId(id));
        if (getUser.assignedTo != update.assignedTo && update.assignedTo) {

            const agent = await User.findById(ObjectId(update.assignedTo));
            //create logs for assign new agent
            notificationHelper.addUserLogs({
                userId: id,
                module: 'agentAssigneToUser',
                message: `New assign - ${getUser.firstName} ` + `${getUser.lastName} assigned to ${agent.firstName} ` + `${agent.lastName} `,
                isRead: false,
                redirectUrl: `/user-detail/${id}`
            });
        }

        const user = await User.findByIdAndUpdate(id, { $unset: unset, $set: update }, { new: true });
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
        //if there is no image, return success message
        // if (user) return res.status(200).json({ user: userData, message: 'User has been updated' });
        if (user) return res.status(200).json({ user: user, message: 'User has been updated' });

        // const user_ = await User.findByIdAndUpdate(id, { $set: update }, { $set: { profileImage: result.url } }, { new: true });

        // if (!req.file) return res.status(200).json({ user: user_, message: 'User has been updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DESTROY api/user/{id}
// @desc Delete User
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const updated = await User.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        if (updated) return res.status(200).json({ updated, message: 'User deleted' });
        res.status(200).json({ message: 'User has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route Destroy api/hard-delete-user/{id}
// @desc Delete User and his Wallets
// @access Public
exports.hard_destroy = async function (req, res) {
    try {
        const id = req.params.id;
        var wallet = true;
        while (wallet) {
            wallet = await Wallet.findOneAndDelete({ userId: id });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.recover = async function (req, res) {
    try {
        const id = req.params.id;
        const updated = await User.findByIdAndUpdate(id, { $set: { isDeleted: false } }, { new: true });
        if (updated) return res.status(200).json({ updated, message: 'User recovered' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id }).exec();
        let hashedOldPass = 0;
        if (user) {
            if (req.body.oldPassword) {
                bcrypt.compare(
                    req.body.oldPassword,
                    user.password,
                    async (err, result) => {
                        if (err || !result) {
                            return res.status(403).send({
                                status: 403,
                                message: "You entered incorrect old password!",
                            });
                        } else {
                            let hash = 0;
                            if (req.body.password) {
                                const salt = await bcrypt.genSalt(10);
                                hash = await bcrypt.hash(req.body.password, salt);
                            }
                            var update = await User.findByIdAndUpdate(id, {
                                password: hash,
                            });
                            return res.status(200).json({
                                status: 200,
                                user: update,
                                message: "Password changed successfully!",
                            });
                        }
                    }
                );
            }
        } else {
            return res.status(403).json({
                status: 200,
                message: "User not found!",
            });
        }

    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

exports.forgetPassword = async function (req, res) {
    try {
        if (req.body) {
            if (req.body.password == req.body.confirmPassword) {
                const tokenData = await Token.findOne({ token: req.body.token })
                const filter = { _id: tokenData.userId }
                const updateUser = await User.findOne(filter)
                updateUser.password = req.body.password
                updateUser.save()
            } else {
                res.send("Password didn't matched");
            }
            res.send("Password changed successfully");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgetPasswordEmail = async function (req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user && !mongoose.Types.ObjectId.isValid(user._id))
            return res.status(400).send("user with given email doesn't exist");
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = process.env.SITE_URL + "/forget-password/" + token.token;
        const to = user.email
        const from = process.env.FROM_EMAIL
        const subject = "Password reset"
        const html = link
        await sendEmail({ to, from, subject, html });
        res.send("password reset link sent to your email account");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 0 = All users
// 1 = Master
// 2 = Master Partners
// 3 = Slaves
exports.usersAgainstRole = async (req, res) => {
    try {

        const role_id = req.body.role_id;
        const user_id = req.body.user_id;
        const client_type = req.body.clientType;
        let userType = req.body.userType;
        const response = await getUsers(role_id, user_id, client_type, userType);
        return res.status(200).json({ status: 200, referral: response });
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

const convertCurrenciesToUSD = async (allUsers) => {
    const allCurrencies = await Currency.find();
    const coins = 'ETH,LINK,AVAX,DOGE,BCH,LTC,TRX,BNB,ADA,BTC,USD,AUD,CAD,NZD,EUR,GBP';
    // set url as constant
    const URL = `https://min-api.cryptocompare.com/data/price?fsym=USDT&tsyms=${coins}&api_key=6f8e04fc1a0c524747940ce7332edd14bfbacac3ef0d10c5c9dcbe34c8ef9913`

    let newUsers = await fetch(URL)
        .then(response =>
            response.json()
        )
        .then(async (json) => {
            for (let i = 0; i < allUsers.length; i++) {
                let amounts = allUsers[i]?.users?.account?.[0]?.amounts;
                let account_id = allUsers[i]?.users?.account?.[0]?._id;
                let total = 0;
                allCurrencies.map(currency => {
                    if (currency?.symbol == 'USDT') {
                        currency.symbol = 'USD';
                    }
                    if (json[currency.symbol]) {
                        let sum = parseFloat(parseFloat((1 / json[currency.symbol])) * parseFloat(amounts?.find(row => row.currencyId.toString() == currency._id.toString())?.amount));
                        if (sum) {
                            total += sum
                        }
                    }
                });
                if (account_id) {
                    const newAccount = await Account.findByIdAndUpdate(account_id, { $set: { previousTotalAmount: total } }, { new: true });
                    if (newAccount) {
                        allUsers[i].users.account = newAccount;
                    }
                }
            }
            return allUsers;
        })
        .catch(err => console.error(err));
    return newUsers;
}

exports.addCurrencyAmountToAccount = async function (req, res) {
    try {
        const { userId, currencyId, amount, addedBy } = req.body;
        const user = await User.findById(userId);

        if (req.body.isResolved == 1) {
            const result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(currencyId), userId: ObjectId(userId) }, { $inc: { "amounts.$.amount": amount } }).exec();
            
            if (!result)
            return res.status(200).json({ message: 'Something went wrong', status: 2 });
        }

        const wallet = await Wallet.findOne({ userId: userId, currencyId: currencyId });
        const account = await Account.findOne({ userId: userId });
        const currency = await Currency.findById(currencyId);
        const newTransaction = new Transaction({ userId: userId, toAccount: userId, currencyId: currencyId, amount: req.body.amount, userAccountId: account?._id, transactionType: 0, walletAddress: wallet?.address, currency: currency?.symbol, additionalInfo: req.body.additionalInfo, isReal: req.body.isReal, isResolved: req.body.isResolved, balanceType: req.body.balanceType, addedBy: ObjectId(addedBy) });
        if (wallet) {
            newTransaction.walletAddress = wallet?.address;
        }
        const transaction_ = await newTransaction.save();

        //create logs for depost amount from admin side
        let getUser = await User.findById(ObjectId(addedBy));
        notificationHelper.addUserLogs({
            userId: userId,
            module: 'DepositPaymentAdmin',
            message: `Admin user - ${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited ${req.body.isReal == true ? 'Real' : 'Fake'} ${req.body.amount} ${currency?.symbol}.  `,
            isRead: req.body.isReal,
            redirectUrl: `/user-detail/${userId}`
        });

        // send email
        subject = "Deposit";
        to = user.email;
        from = process.env.FROM_EMAIL;
        fullName = user.firstName + ' ' + user.lastName;
        currencyDetails = { 'amount': amount, 'currency': currency?.symbol };
        html = depositEmailTemplate(fullName, currencyDetails);

        await sendEmail({ to, from, subject, html });
        res.status(200).json({ message: 'Amount has been successfully added.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changeLeverageStartPrice = async function (req, res) {
    try {
        const { userId, leverageOrderId, tradeStartPrice } = req.body;
        const result = await Account.findOneAndUpdate({ "tradeStartPrice.leverageOrderId": ObjectId(leverageOrderId), userId: ObjectId(userId) }, { $inc: { "tradeStartPrice.$.tradeStartPrice": tradeStartPrice } }).exec();
        if (result) {
            const leverageOrder = await leverageOrder.findOne({ userId: userId, leverageOrderId: leverageOrderId });
            const account = await account.findOne({ userId: userId });
            const leverageOrderId = await leverageOrderId.findById(leverageOrderId);
            const newTradeStartPrice = new tradeStartPrice({ userId: userId, toAccount: userId, leverageOrderId: leverageOrderId, tradeStartPrice: req.body.tradeStartPrice, userAccountId: account?._id, leverageOrder: leverage?.leverageOrderId, pairName: pairName?.symbol, isResolved: 1 });
            if (leverageOrder) {
                newTradeStartPrice.leverageOrderId = leverageOrderId;
            }
            const tradeStartPrice_ = await newTradeStartPrice.save();
            res.status(200).json({ message: 'Start Price has been changed' });
        }
        else {
            res.status(500).json({ message: 'Something went wrong' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeCurrencyAmountFromUserAccount = async function (req, res) {
    try {
        const { userId, currencyId, amount, addedBy } = req.body;

        let getAccountData = await Account.findOne({ "amounts.currencyId": ObjectId(currencyId), userId: ObjectId(userId) });
        let specificAccountData = getAccountData.amounts.find(amounts => amounts.currencyId == currencyId);

        if ((specificAccountData.amount - amount) < 0) {
            return res.status(200).json({ message: 'User does not have enough amount to be withdrawn.', status: 2 });
        }
        else {
            if (req.body.isResolved == 1) {
                const result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(currencyId), userId: ObjectId(userId) }, { $inc: { "amounts.$.amount": -(req.body.amount) } }).exec();

                if (!result)
                    return res.status(200).json({ message: 'Something went wrong', status: 2 });
            }
            
            const wallet = await Wallet.findOne({ userId: userId, currencyId: currencyId });
            const account = await Account.findOne({ userId: userId });
            const currency = await Currency.findById(currencyId);
            const newTransaction = new Transaction({ userId: userId, fromAccount: userId, currencyId: currencyId, amount: req.body.amount, userAccountId: account?._id, transactionType: 1, currency: currency?.symbol, additionalInfo: req.body.additionalInfo, isReal: req.body.isReal, isResolved: req.body.isResolved, balanceType: req.body.balanceType, addedBy: ObjectId(addedBy) });
            
            if (wallet) {
                newTransaction.walletAddress = wallet?.address;
            }
            const transaction_ = await newTransaction.save();

            //create logs for depost amount from admin side
            let getUser = await User.findById(ObjectId(addedBy));
            notificationHelper.addUserLogs({
                userId: userId,
                module: 'WithdrawPaymentAdmin',
                message: `Admin user - ${getUser.firstName} `+  `${getUser.lastName} `+ `has Withdrawn ${req.body.isReal == true ? 'Real' : 'Fake'} ${req.body.amount} ${currency?.symbol}.  `,
                isRead: req.body.isReal,
                redirectUrl: `/user-detail/${userId}`
            });
            res.status(200).json({ message: 'Withdraw transaction is created successfully.', status: 1 });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resolveWithDrawTransaction = async function (req, res) {
    try {
        const id = req.params.id;
        const resolvedStatus = req.body.resolvedStatus;
        const additionalInfo = req.body.additionalInfo;

        let transaction = await Transaction.findById(id);
        if (!transaction)
            transaction = await ExternalTransaction.findById(id);

        if (transaction) {
            if (resolvedStatus == 1) {
                let getAccountData = await Account.findOne({ "amounts.currencyId": ObjectId(transaction.currencyId), userId: ObjectId(transaction.userId) });
                let specificAccountData = getAccountData.amounts.find(amounts => amounts.currencyId == transaction.currencyId.toString());

                if ((specificAccountData.amount - transaction.amount) < 0) {
                    return res.status(200).json({ message: 'User does not have enough amount to be withdrawn.', status: 2 });
                }
                else {
                    const result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(transaction.currencyId), userId: ObjectId(transaction.userId) }, { $inc: { "amounts.$.amount": -transaction.amount } }).exec();

                    if (!result)
                        return res.status(200).json({ message: 'Something went wrong', status: 2 });
                }
            }
            transaction.isResolved = resolvedStatus;
            transaction.additionalInfo = additionalInfo;
            const transaction_ = await transaction.save();
            return res.status(200).json({ message: 'Transaction has been updated successfully.', status: 1 });
        }
        else {
            return res.status(200).json({ message: 'Unable to find transaction.', status: 2 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resolveDepositTransaction = async function (req, res) {
    try {
        const id = req.params.id;
        const resolvedStatus = req.body.resolvedStatus;
        const additionalInfo = req.body.additionalInfo;

        let transaction = await Transaction.findById(id);
        if (!transaction)
            transaction = await ExternalTransaction.findById(id);

        if (transaction) {
            if (resolvedStatus == 1) {
                const result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(transaction.currencyId), userId: ObjectId(transaction.userId) }, { $inc: { "amounts.$.amount": transaction.amount } }).exec();

                if (!result)
                    return res.status(200).json({ message: 'Something went wrong', status: 2 });
            }
            transaction.isResolved = resolvedStatus;
            transaction.additionalInfo = additionalInfo;
            const transaction_ = await transaction.save();
            return res.status(200).json({ message: 'Transaction has been updated successfully.', status: 1 });
        }
        else {
            return res.status(200).json({ message: 'Unable to find transaction.', status: 2 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.revertTransaction = async function (req, res) {
    try {
        const id = req.params.id;
        let transaction = await Transaction.findById(id);
        
        if (!transaction)
        {
            transaction = await ExternalTransaction.findById(id);
        }
            
        if (transaction) {
            let amount = transaction.amount;
           
            if (transaction.transactionType != 1) {
                amount = -(transaction.amount);
            }
            
            const result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(transaction.currencyId), userId: ObjectId(transaction.userId) }, { $inc: { "amounts.$.amount": amount } }).exec();

            if (!result)
                return res.status(200).json({ message: 'Something went wrong', status: 2 });

            const transactionDel = await transaction.remove();
            return res.status(200).json({ message: 'Transaction has been reverted successfully.', status: 1 });
        }
        else {
            return res.status(200).json({ message: 'Unable to find transaction.', status: 2 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgetPassword = async function (req, res) {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.referralsAgainstId = async function (req, res) {
    try {
        const id = req.params.id;
        const referral = await Referral.aggregate([
            {
                $match: {
                    refererId: ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'users'
                },
            },
            { $unwind: '$users' }
        ])
        res.status(200).json({ referral });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.subadminsListing = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Sub Admin' });

        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: false
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, subAdmins: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", subAdmins: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}
exports.deletedSubadmins = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Sub Admin' });

        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: true
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, subAdmins: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", subAdmins: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}


// Sales Agents
exports.salesagentsListing = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Sales Agent' });

        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: false
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, salesAgents: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", salesAgents: [] });
        }

    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

exports.deletedSalesAgents = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Sales Agent' });

        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: true
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, salesAgents: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", salesAgents: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

// Retention Agents
exports.retenagentsListing = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Retention Agent' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: false
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, retenAgents: documents });
                    }
                }
            );
        } else {
            return res.status(200).send({ status: 400, message: "No user found!", retenAgents: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

exports.deletedRetenAgents = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Retention Agent' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: true
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, retenAgents: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", retenAgents: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

// Supervisors
exports.supervisorsListing = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Supervisor' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: false
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, supervisors: documents });
                    }
                }
            );
        } else {
            return res.status(200).send({ status: 400, message: "No user found!", supervisors: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

exports.deletedSupervisors = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Retention Agent' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: true
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, supervisors: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", supervisors: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

// Sales Team Leads
exports.salesTeamleadsListing = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Sales Team Leads' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: false
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, salesTeamleads: documents });
                    }
                }
            );
        } else {
            return res.status(200).send({ status: 400, message: "No user found!", salesTeamleads: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

exports.deletedSalesTeamleads = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Sales Team Leads' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: true
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, salesTeamleads: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", salesTeamleads: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

// Retention Team Lead
exports.retenTeamleadsListing = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Retention Teamleads' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: false
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, retenTeamleads: documents });
                    }
                }
            );
        } else {
            return res.status(200).send({ status: 400, message: "No user found!", retenTeamleads: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

exports.deletedRetenTeamleads = async (req, res) => {
    try {
        const role = await Role.findOne({ 'name': 'Retention Teamleads' });
        if (role) {
            await User.aggregate(
                [
                    {
                        $match: {
                            roleId: ObjectId(role?._id),
                            isDeleted: true
                        }
                    },
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, retenTeamleads: documents });
                    }
                }
            );
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", retenTeamleads: [] });
        }
    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}


exports.deletedUsers = async (req, res) => {
    try {
        const users = await Referral.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'users'
                },
            },
            { $unwind: '$users' },
            {
                $match: {
                    "users.isDeleted": true
                }
            },
        ])
        res.status(200).json({ users });

    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}

// @route GET api/user/user-details/{id}
// @desc Returns a specific user
// @access Public
exports.userDetails = async function (req, res) {
    try {
        const id = req.params.id;
        let userClientType = 1;
        let agentUsers = [];
        const user = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'referrals',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'ref'
                },
            },
            {
                $lookup: {
                    from: 'referrals',
                    localField: '_id',
                    foreignField: 'refererId',
                    as: 'referals'
                },
            },
            {
                $lookup: {
                    from: 'externaltransactions',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'externalTransactions',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'accounts',
                                localField: 'userId',
                                foreignField: 'userId',
                                as: 'account',
                            },
                        },
                        {
                            $unwind: '$account'
                        },
                        {
                            $sort: { 
                                'createdAt': -1 
                            }
                        }
                    ],
                },
            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'adminTransactions',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'accounts',
                                localField: 'userId',
                                foreignField: 'userId',
                                as: 'account',
                            },
                        },
                        {
                            $unwind: '$account'
                        },
                        {
                            $sort: { 
                                'createdAt': -1 
                            }
                        }
                    ],
                },
            },
            {
                $lookup: {
                    from: 'externalbanktransactions',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'bankTransactions',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'accounts',
                                localField: 'userId',
                                foreignField: 'userId',
                                as: 'account',
                            },
                        },
                        {
                            $unwind: '$account'
                        },
                        {
                            $sort: { 
                                'createdAt': -1 
                            }
                        }
                    ],
                },
            },
            {
                $lookup: {
                    from: 'externalfiattransactions',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'fiatTransactions',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'accounts',
                                localField: 'userId',
                                foreignField: 'userId',
                                as: 'account',
                            },
                        },
                        {
                            $unwind: '$account'
                        },
                        {
                            $sort: { 
                                'createdAt': -1 
                            }
                        }
                    ],
                },
            },
            {
                $lookup: {
                    from: 'accounts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'account'
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'affialiateId',
                    foreignField: '_id',
                    as: 'affiliator'
                }
            },
            {
                $lookup: {
                    from: 'salesstatuses',
                    localField: 'salesStatusId',
                    foreignField: '_id',
                    as: 'salesStatus'
                }
            },
            {
                $unwind: {
                    path: "$salesStatus",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: '$ref'
            },
            {
                $unwind: '$account'
            }
        ])
        if (!user || user?.length < 1) return res.status(401).json({ message: 'User does not exist' });

        let internals = await InternalOrderHistory.aggregate([
            {
                $match: {
                    userId: ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'fromCurrency',
                    foreignField: '_id',
                    as: 'fromCurrency'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'toCurrency',
                    foreignField: '_id',
                    as: 'toCurrency'
                }
            },
            {
                $unwind: '$fromCurrency'
            },
            {
                $unwind: '$toCurrency'
            }
        ])

        if (user?.[0]?.clientType) {
            userClientType = user?.[0]?.clientType;
        }

        if (userClientType == 1) // Client user
        {
            const salesAgentRole = await Role.findOne({ name: 'Sales Agent' });
            agentUsers = await User.find({ roleId: ObjectId(salesAgentRole?._id) })
        }
        else {
            const retentAgentRole = await Role.findOne({ name: 'Retention Agent' });
            agentUsers = await User.find({ roleId: ObjectId(retentAgentRole?._id) })
        }

        let data = user?.[0];
        data['internalTransaction'] = internals;
        data['agentUsers'] = agentUsers;

        res.status(200).json({ user: data });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.sendOTP = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(401).send({ message: 'Invalid email address.' });
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        user.otpCode = otpCode;
        user.save();
        let subject = "OTP for Account Verification";
        let to = email;
        let from = process.env.from_email;
        let html = 'OTP is: ' + otpCode;
        await sendEmail({ to, from, subject, html });
        return res.status(200).json({
            success: true,
            message: 'Email for OTP Account Verification has been sent to ' + email + '.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const email = req.body.email;
        const otpCode = req.body.otpCode;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(401).send({ message: 'Invalid email address.' });
        if (user.otpCode == otpCode) {
            user.otpStatus = true;
            user.save();
            return res.status(200).json({
                success: true,
                message: 'Successfully Verified'
            });
        } else {
            // if (user.optCode == otp)
            return res.status(401).send({ message: 'Invalid OTP.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.verifyTFA = async (req, res) => {
    try {
        const email = req.body.email;
        const code = req.body.code;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(401).send({ message: 'Invalid email address.' });
        const { secret } = user;
        if (!authenticator.check(code, secret)) {
            return res.status(401).send({ message: 'Invalid 2FA Code.' });
        } else {
            user.otpStatus = !user.otpStatus;
            user.save();
            return res.status(200).json({
                success: true,
                message: 'Successfully Verified'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getUserConvertBalance = async (req, res) => {
    try {
        console.log("Farhan in getUserConvertBalance");
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAllUsersConvertBalance = async (req, res) => {
    try {
        console.log("Farhan in getAllUsersConvertBalance");
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.addClientTypes = async function (req, res) {
    try {
        const role = await Role.findOne({ 'name': 'Master' });

        if (role) {
            await User.updateMany({ roleId: ObjectId(role?._id) }, { $set: { clientType: 1 } });
            res.status(200).json({ message: 'All users has been assigned Lead role' });
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DESTROY api/users/delete-multiple-users
// @desc Soft Delete Multiple Users
// @access Public
exports.deleteMultipleUsers = async function (req, res) {
    try {
        const { ids } = req.body;
        const updated = await User.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true } }, { new: true });
        if (updated) return res.status(200).json({ updated, message: 'All selected users have been deleted' });
        return res.status(500).json({ message: 'Something went wrong' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @route PUT api/users/update-multiple-users
// @desc Soft Delete Multiple Users
// @access Public
exports.updateMultipleUsers = async function (req, res) {
    try {
        const { ids } = req.body;
        const update = req.body;
        const updated = await User.updateMany({ _id: { $in: ids } }, { $set: update }, { new: true });
        if (updated) return res.status(200).json({ updated, message: 'All selected users have been updated' });
        return res.status(500).json({ message: 'Something went wrong' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// @route GET api/users/managers
// @desc Get Managers
// @access Public
exports.managers = async (req, res) => {
    try {
        const adminRole = await Role.findOne({ 'name': 'Admin' });
        const subAdminRole = await Role.findOne({ 'name': 'Sub Admin' });
        const supervisorRole = await Role.findOne({ 'name': 'Supervisor' });
        queryObject = {
            $or: [{ roleId: ObjectId(adminRole?._id) }, { roleId: ObjectId(subAdminRole?._id) }, { roleId: ObjectId(supervisorRole?._id) }],
        };

        if (adminRole || subAdminRole || supervisorRole) {
            await User.aggregate(
                [
                    {
                        $match: queryObject,
                    },
                    {
                        $match: {
                            isDeleted: false
                        }
                    }
                ],

                async function (err, documents) {
                    if (err) {
                        res.json({
                            status: "error",
                            message: err,
                        });
                        return;
                    } else {
                        return res.status(200).json({ status: 200, managers: documents });
                    }
                }
            );
        } else {
            return res.status(200).send({ status: 400, message: "No user found!", managers: [] });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// @route PUT api/users/affiliate-token
// @desc Creat or Update Affiliate Token
// @access Public
exports.updateAffiliateToken = async function (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (user) {
            const token = await user.generateAffiliateJWT();
            user.affialiateToken = token;
            user.save();
            return res.status(200).send({ status: true, message: "Affiliate token updated!", token: token });
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route POST api/users/affiliate/leads
// @desc Create leads of a affiliate reference
// @access Public
exports.createAffiliateLeads = async function (req, res) {
    try {
        var header = req.headers.authorization || '';
        let { leads } = req.body;

        if (header) {
            const affiliate = await User.findOne({ 'affialiateToken': header });

            if (affiliate) {
                let data = await createUsers(leads, affiliate?._id);

                if (data?.valid) {
                    for (const affiliateuser of data?.valid) {

                        const user = await User.findById(affiliateuser?.id);
                        console.log(user, "useruser")
                        if (user?._id) {

                            //create logs for assign new agent
                            notificationHelper.addUserLogs({
                                userId: user._id,
                                module: 'newLeadUploaded',
                                message: `New lead - ${user.firstName} ` + `${user.lastName} ` + `has been created.`,
                                isRead: false,
                                redirectUrl: `/user-detail/${user._id}`
                            });
                        }
                    }
                }

                return res.status(200).send({ status: true, data });
            }
            else {
                return res.status(403).send({ error: "FORBIDDEN", message: "FORBIDDEN" });
            }
        }
        else {
            return res.status(403).send({ error: "FORBIDDEN", message: "FORBIDDEN" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/users/affiliate/leads
// @desc Create leads of a affiliate reference
// @access Public
exports.getAffiliateLeads = async function (req, res) {
    try {
        var header = req.headers.authorization || '';

        if (header) {
            const affiliate = await User.findOne({ 'affialiateToken': header });

            if (affiliate) {
                const leads = await User.find({ affialiateId: affiliate?._id });

                return res.status(200).send({ status: true, message: "Leads Listing", leads });
            } else {
                return res.status(403).send({ error: "FORBIDDEN", message: "FORBIDDEN" });
            }
        }
        else {
            return res.status(403).send({ error: "FORBIDDEN", message: "FORBIDDEN" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route POST api/users/csv/leads
// @desc Create leads from a csv file
// @access Public
exports.importDataFromCSV = async function (req, res) {
    try {
        let userDetails = [];
        let jsonArray = [];
        if (req.file) {
            // Async / await usage
            const { csvFileExtension } = req.body;

            if (csvFileExtension == 'xlsx') {
                await readXlsxFile(req.file.path)
                    .then(async (rows) => {
                        rows.forEach(async (row, index) => {
                            totalCount = rows.length - 1;
                            if (index > 0) {
                                let param = {
                                    email: row[0],
                                    firstName: row[1],
                                    lastName: row[2],
                                    phone: row[3],
                                    country: row[4],
                                    username: row[5],
                                    password: row[6],
                                    clientType: row[7],
                                    clientStatus: row[8],
                                    additionalInfo: row[9]
                                }
                                jsonArray.push(param)
                            }
                        });
                    }).
                    catch((error) => {
                        console.log('error', error);
                    });
                if (jsonArray?.length > 0) {
                    userDetails = await createUsers(jsonArray);
                }
            }
            else if (csvFileExtension == 'csv') {
                jsonArray = await csv().fromFile(req.file.path);
                if (jsonArray?.length > 0) {
                    userDetails = await createUsers(jsonArray);
                }
            }
            else {
                return res.status(200).send({ status: 404, message: "The file must be a file of type: csv,xlsx" });
            }

            return res.status(200).send({ status: true, message: "User(s) created successfully", userDetails: userDetails });
        }
        else {
            return res.status(200).send({ status: 404, message: "File not found!" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route POST api/users/export/leads
// @desc Create leads from a csv file
// @access Public
exports.exportDataToFile = async function (req, res) {
    const fields = ['email', 'firstName', 'lastName', 'phone', 'country', 'username', 'additionalInfo'];
    const opts = { fields };

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;
    const client_type = req.body.clientType;
    const userType = req.body.userType;
    const response = await getUsers(role_id, user_id, client_type, userType);

    var myData = await response.map(item => {
        return {
            'email': item?.users?.email ? item?.users?.email : '-',
            'firstName': item?.users?.firstName ? item?.users?.firstName : '-',
            'lastName': item?.users?.lastName ? item?.users?.lastName : '-',
            'phone': item?.users?.phone ? item?.users?.phone : '-',
            'country': item?.users?.country?.[0]?.nicename ? item?.users?.country?.[0]?.nicename : '-',
            'username': item?.users?.username ? item?.users?.username : '-',
            'additionalInfo': item?.users?.additionalInfo ? item?.users?.additionalInfo : '-'
        }
    });

    try {
        const parser = new Parser(opts);
        const csv = parser.parse(myData);
        const fileName = 'Leads_' + Date.now() + '.csv';

        if (!fs.existsSync('./upload/export-leads')) {
            fs.mkdir('./upload/export-leads',
                { recursive: true }, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    else {
                        fs.appendFileSync("./upload/export-leads/" + fileName, csv);
                    }
                });
        }
        else {
            fs.appendFileSync("./upload/export-leads/" + fileName, csv);
        }

        return res.status(200).send({ status: true, message: "User(s) exported successfully", csvFile: baseURL + '/images/export-leads/' + fileName });
    } catch (err) {
        console.error(err);
    }
};

const QRGenerate = (email, secret) => {
    return QRCode.toDataURL(
        authenticator.keyuri(email, 'OBTX 2FA', secret)
    )
}

const getUsers = async (role_id, user_id, client_type, userType) => {
    try {
        const role = await Role.findOne({ _id: role_id });
        if (userType == 0) {
            queryObject = {
                $or: [{ userType: "Master" }, { userType: "Partner" }, { userType: "Slave" }],
            };
        } else {
            if (userType == 1) {
                userType = "Master"
            } else if (userType == 2) {
                userType = "Partner"
            } else if (userType == 3) {
                userType = "Slave"
            }
            queryObject = {
                userType: userType,
            };
        }
        if (role.name == 'Admin' || role.name == 'Sub Admin' || role.name == 'Supervisor' || role.name == 'Sales Team Leads' || role.name == 'Retention Teamleads') {
            let data = await Referral.aggregate(
                [
                    {
                        $match: queryObject,
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'users',
                            "pipeline": [
                                {
                                    "$lookup": {
                                        "from": "countries",
                                        "localField": "countryCode",
                                        "foreignField": "iso",
                                        "as": "country"
                                    }
                                },
                                {
                                    "$lookup": {
                                        "from": "accounts",
                                        "localField": "_id",
                                        "foreignField": "userId",
                                        "as": "account"
                                    }
                                },
                                {
                                    "$lookup": {
                                        "from": "users",
                                        "localField": "assignedTo",
                                        "foreignField": "_id",
                                        "as": "assignedToAgent"
                                    }
                                },
                                {
                                    "$lookup": {
                                        "from": "users",
                                        "localField": "affialiateId",
                                        "foreignField": "_id",
                                        "as": "affiliator"
                                    }
                                }
                            ]
                        },
                    },
                    { $unwind: '$users' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'refererId',
                            foreignField: '_id',
                            as: 'referer'
                        },
                    },
                    {
                        $unwind: {
                            path: '$referer',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: {
                            "users.isDeleted": false,
                            "users.clientType": client_type
                        },
                    }
                ],
            );
            const response = data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
            });

            let convert = '';
            if (response?.length > 0)
                convert = await convertCurrenciesToUSD(response);

            if (convert && convert?.length > 0) {
                return convert;
            }
            else {
                return response;
            }

        }
        else if (role.name == 'Sales Agent' || role.name == 'Retention Agent') {
            let data = await Referral.aggregate(
                [
                    {
                        $match: queryObject,
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'users',
                            "pipeline": [
                                {
                                    "$lookup": {
                                        "from": "countries",
                                        "localField": "countryCode",
                                        "foreignField": "iso",
                                        "as": "country"
                                    }
                                },
                                {
                                    "$lookup": {
                                        "from": "accounts",
                                        "localField": "_id",
                                        "foreignField": "userId",
                                        "as": "account"
                                    }
                                }
                            ]
                        },
                    },
                    { $unwind: '$users' },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'refererId',
                            foreignField: '_id',
                            as: 'referer'
                        },
                    },
                    {
                        $unwind: {
                            path: '$referer',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: {
                            "users.isDeleted": false,
                            "users.clientType": client_type,
                            "users.assignedTo": ObjectId(user_id)
                        },
                    },
                ],
            );
            const response = data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
            });

            let convert = '';
            if (response?.length > 0)
                convert = await convertCurrenciesToUSD(response);

            if (convert && convert?.length > 0) {
                return convert;
            }
            else {
                return response;
            }

        }
        else {
            let data2 = await Referral.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'users',
                        "pipeline": [
                            {
                                "$lookup": {
                                    "from": "countries",
                                    "localField": "countryCode",
                                    "foreignField": "iso",
                                    "as": "country"
                                }
                            },
                            {
                                "$lookup": {
                                    "from": "accounts",
                                    "localField": "_id",
                                    "foreignField": "userId",
                                    "as": "account"
                                }
                            }
                        ]
                    },
                },
                {
                    $match: {
                        refererId: ObjectId(user_id),
                    }
                },
                {
                    $match: {
                        "users.isDeleted": false,
                        "users.clientType": client_type
                    },
                },
                {
                    $match: queryObject,
                },
                { $unwind: '$users' },

            ])
            const response = data2.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt)
            });
            return response;
        }
    } catch (e) {
        return '';
    }
}

const createUsers = async (leads, affiliate_id) => {
    var userDetails = [];
    var validUsers = [];
    var invalidUsers = [];
    var duplicateEmails = [];
    var duplicatePhones = [];
    var validCnt = 0;
    var invalidCnt = 0;
    var duplicateEmailsCnt = 0;
    var duplicatePhonesCnt = 0;

    for (let i = 0; i < leads.length; i++) {
        let invalidUserfound = false;
        let invalidMessage = 'Duplicate ';
        let data = leads[i];
        const { email, refCount, refererId } = data;

        if (data?.username) {
            let checkusername = await User.findOne({ username: data.username });
            if (checkusername) {
                userDetails.push({ email: email, status: false, message: 'The username already exist.' });
                invalidMessage += 'username, ';
                invalidUserfound = true;
            }
        }
        else {
            data.username = email;
        }

        if (data?.phone) {
            let checkphone = await User.findOne({ phone: data.phone });
            if (checkphone) {
                userDetails.push({ email: email, status: false, message: 'The phone already exist.' });
                duplicatePhones.push(data?.phone);
                invalidMessage += 'phone, ';
                duplicatePhonesCnt += 1;
                invalidUserfound = true;
            }
        }

        const user = await User.findOne({ email });
        if (user) {
            userDetails.push({ email: email, status: false, message: 'The email address already exist.' });
            duplicateEmails.push(email);
            invalidMessage += 'email, ';
            duplicateEmailsCnt += 1;
            invalidUserfound = true;
        }

        if (refererId) {
            newRef.refererId = ObjectId(refererId)
            const refFound = await Referral.findOne({ 'refererId': ObjectId(refererId) });
            if (!refFound) {
                userDetails.push({ email: email, status: false, message: 'Referer Code Not Found!' });
                invalidUserfound = true;
            }
        }

        if (invalidUserfound) {
            invalidMessage = invalidMessage.replace(/,\s*$/, "");
            invalidCnt += 1;
            invalidUsers.push({ email: email, phone: data?.phone, message: invalidMessage });
            continue;
        }

        const newUser = new User({ ...data });
        if (data?.country) {
            const country = await Country.findOne({ 'nicename': { '$regex': data?.country, $options: 'i' } });
            if (country?.iso)
                newUser.countryCode = country.iso;
        }
        if (affiliate_id) {
            newUser.affialiateId = affiliate_id;
        }

        newUser.isVerified = true;
        newUser.status = true;
        const newRef = new Referral({ userId: newUser._id });


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
        account_ = await newAccount.save();
        referral = await newRef.save();
        const user_ = await newUser.save();
        if (user_) {
            userDetails.push({ email: email, userId: user_?._id, status: true, message: 'User created successfully!' });
            validCnt += 1;
            validUsers.push({ id: user_?._id, email: user_?.email, phone: user_?.phone, login_url: siteURL + '/admin/aff/deposit?otl=' + user_?._id, status: true, message: 'User created successfully!' });
            continue;
        }
        let userData = { ...newUser._doc }
        // return res.status(200).json({ success: true, user: userData, message: 'Sub Admin created successfully' });
    }
    let data = {
        "validCnt": validCnt,
        "invalidCnt": invalidCnt,
        "duplicateEmailsCnt": duplicateEmailsCnt,
        "duplicatePhonesCnt": duplicatePhonesCnt,
        "invalid": invalidUsers,
        "valid": validUsers,
        "duplicateEmails": duplicateEmails,
        "duplicatePhones": duplicatePhones
    };
    return data;

}

exports.userLastActivity = async (req, res) => {
    try {
        const update = { lastLoginAt: new Date(Date.now()) };
        await User.findByIdAndUpdate(req.params.userId, update, {
            new: true
        });

        return res.status(200).json({ message: 'request updated!' });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
};

// List all agents 
exports.listAgents = async (req, res) => {
    try {

       
        var role_id = [];
        //pass role id to get agents against specific role
        // if(req?.params?.roleId) {
        //     role_id.push(ObjectId(req?.params?.roleId));
        // } else {
        //     const Permission = await PermissionsModule.aggregate([
        //         {
        //             $match: {
        //                 "name": 'Agent'
        //             }
        //         },
        //         {
        //             $lookup: {
        //                 from: 'permissions',
        //                 localField: '_id',
        //                 foreignField: 'permissionModule',
        //                 as: 'permission'
        //             },
        //         },
        //         { $unwind: '$permission' }
        //     ]);
        //     let getAgentRole
    
        //     if(ObjectId(Permission[0]?.permission?._id).valueOf()) {
        //         getAgentRole = await Role.find(
        //             {
        //                 permissionIds: { 
        //                     $elemMatch: 
        //                     {   
        //                         $eq: ObjectId(Permission[0].permission._id) 
        //                     } 
        //                 }
        //             }
        //         )
    
        //         for( const agentRole in getAgentRole) {
        //             let roleId = ObjectId(getAgentRole[agentRole]._id).valueOf();
        //             role_id.push(ObjectId(roleId));
        //         }
        //     }
        // }
        
        // if (role_id) {
         
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'roleId',
                        foreignField: '_id',
                        as: 'userRole'
                    },
                },
                { $unwind: '$userRole' },
                {
                    $match: 
                    {
                        "$and":[
                            //{ roleId: { "$in": role_id} },
                            {isDeleted: false}
                        ]
                    }
                }
            ]);
            return res.status(200).json({ status: 200, agents: users });
        // }
        // else {
        //     return res.status(200).send({ status: 400, message: "No user found!", agents: [] });
        // }

    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!", error: e });
    }
}

// List all agent roles
exports.listAgentRoles = async (req, res) => {
    try {

        // const Permission = await PermissionsModule.aggregate([
        //     {
        //         $match: {
        //             "name": 'Agent'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'permissions',
        //             localField: '_id',
        //             foreignField: 'permissionModule',
        //             as: 'permission'
        //         },
        //     },
        //     { $unwind: '$permission' }
        // ]);
        let getAgentRole = await Role.find(
            {
                // permissionIds: { 
                //     $elemMatch: 
                //     {   
                //         $eq: ObjectId(Permission[0].permission._id) 
                //     } 
                // }
            }
        )

        if (getAgentRole) {
            return res.status(200).json({ status: 200, getAgentRole });
        }
        else {
            return res.status(200).send({ status: 400, message: "No user found!", agents: [] });
        }

    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!", error: e });
    }
}


//delete agent
exports.deletedAgent = async (req, res) => {
    try {

        let id = req?.params?.id;
        if(id) {

            await User.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });

            return res.status(200).json({ status: 200, status: true,message: 'Record delete successfully!' });
        } else {

            return res.status(200).json({ status: 200, status: false,message: 'Record not deleted!' });
        }

    } catch (e) {
        return res.status(200).send({ status: 400, message: "No user found!" });
    }
}