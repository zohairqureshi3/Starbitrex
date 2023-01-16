const Account = require("../models/account");
const User = require("../models/user");
var mongoose = require("mongoose");
const externalTransaction = require("../models/externalTransaction");
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.index = async function (req, res) {
    const accounts = await Account.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "users",
            },
        },
        {
            $project: {
                name: 1,
                "users.name": 1,
            },
        },
    ]);
    res
        .status(200)
        .json({ success: true, message: "List of accounts", accounts });
};

// update account balance accounts of admin
exports.accountsAgainstId = async function (req, res) {
    try {
        const response = req.body;
        let getAccountData = await Account.findOne({
            'userId': response.userId,
            'amounts.currencyId': response.currencyId
        });
        let specificAccountData = getAccountData.amounts.find(amounts => amounts.currencyId == response.currencyId.toString());
        let data = await Account.updateOne(
            {
                'userId': response.userId,
                'amounts.currencyId': response.currencyId
            },
            {
                $set: {
                    "amounts.$.amount": parseFloat(specificAccountData.amount) + parseFloat(response.amount)
                }
            }
        ).exec();
        res.status(200).json({ success: true, message: "Balance added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST api/account/add
// @desc Add a new account
// @access Public
exports.store = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const newAccount = new Account({
                userId: user._id,
                name: user.username + "-s-account",
                currencyId: req.body.currencyId,
                amounts: req.body.amounts,
            });
            const account_ = await newAccount.save();
            res
                .status(200)
                .json({
                    success: true,
                    message: "Account created successfully",
                    account_,
                });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET api/account/{id}
// @desc Returns a specific account
// @access Public
exports.show = async function (req, res) {
    const id = req.params.id;
    const account = await Account.findOne({ 'userId': id })
    res.status(200).json({ success: true, message: "User's account", account });
};

// @route PUT api/account/{id}
// @desc Update account details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        // const accountId = req.account._id;
        // Make sure the passed id is that of the logged in account
        // if (accountId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the user to upd this data."});

        const account = await Account.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        );

        //if there is no image, return success message
        if (!req.file)
            return res
                .status(200)
                .json({ account, message: "Account has been updated" });

        const account_ = await Account.findByIdAndUpdate(
            id,
            { $set: update },
            { $set: { profileImage: result.url } },
            { new: true }
        );

        if (!req.file)
            return res
                .status(200)
                .json({ account: account_, message: "Account has been updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Account.findByIdAndDelete(id);
        res.status(200).json({ message: "Account has been deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.transferAmounts = async function (req, res) {
    try {
        const data = req.body;
        const account = await Account.findOne({ userId: ObjectId(data.userId) });
        if (data.from == 1 && data.to == 2) {
            let row = account.amounts.find(cur => cur.currencyId.toString() == data.currencyId)
            row.amount = parseFloat(row.amount) - parseFloat(data.amount);
            row.futures_amount = parseFloat(row.futures_amount) + parseFloat(data.amount);
            account.save()
        }
        else if (data.from == 2 && data.to == 1) {
            let row = account.amounts.find(cur => cur.currencyId.toString() == data.currencyId)
            row.futures_amount = parseFloat(row.futures_amount) - parseFloat(data.amount);
            row.amount = parseFloat(row.amount) + parseFloat(data.amount);
            account.save()
        }
        res.status(200).json({ message: "Account has been updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/account/{id}
// @desc Update account details
// @access Public
exports.updatePrevAmount = async function (req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        const account = await Account.findByIdAndUpdate(id, { $set: data }, { new: true });
        if (account) return res.status(200).json({ account, message: 'Account has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};