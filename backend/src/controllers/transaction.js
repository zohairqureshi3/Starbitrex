const Transaction = require('../models/transaction');
const Referral = require('../models/transaction');

const User = require('../models/user');
const Account = require('../models/account');
const Currency = require('../models/currency');
const Wallet = require('../models/wallet');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/transaction
// @desc Returns all transactions
// @access Public
// exports.index = async function (req, res) {

exports.index = async function (req, res) {

    try {
        const transactions = await Transaction.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromAccount',
                    foreignField: '_id',
                    as: 'fromAccount'
                }
            },
            {
                $unwind: "$fromAccount"
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'toAccount',
                    foreignField: '_id',
                    as: 'toAccount'
                }
            },
            {
                $unwind: "$toAccount"
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'currencyId',
                    foreignField: '_id',
                    as: 'currencies'
                }
            },
            {
                $unwind: "$currencies"
            },
            {
                $project: {
                    'amount': 1,
                    'fromAccount.firstname': 1,
                    'fromAccount.lastname': 1,
                    'fromAccount.username': 1,
                    'fromAccount.email': 1,
                    'fromAccount._id': 1,
                    'toAccount._id': 1,
                    'toAccount.firstName': 1,
                    'toAccount.lastname': 1,
                    'toAccount.username': 1,
                    'toAccount.email': 1,
                    'currencies.name': 1,
                    'currencies.symbol': 1,
                }
            }
        ])
        res.status(200).json({ success: true, message: "List of transactions", transactions })
    } catch (e) {
        res.status(500).json({ success: false, message: "Something went wrong" })
    };


};

exports.getAllAdminDeposits = async function (req, res) {
    const adminDeposits = await Transaction.aggregate([
        {
            $match: {
                transactionType: false
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'toAccount',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $sort: { 
                'createdAt': -1 
            }
        }
    ]);
    res.status(200).json({ success: true, message: "List of transactions", adminDeposits })
};

// @route POST api/transaction/add
// @desc Add a new transaction
// @access Public

exports.store = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();

        if (user) {
            const getToAccount = await Account.findOne({ userId: user._id })
            const getFromAccount = await Account.findOne({ userId: req.body.fromAccount })
            const wallet = await Wallet.findOne({ userId: user._id, currencyId: req.body.currencyId });
            const currency = await Currency.findById(req.body.currencyId);
            const newTransaction = new Transaction({ userId: user._id, fromAccount: req.body.fromAccount, toAccount: user._id, currencyId: req.body.currencyId, amount: req.body.amount, userAccountId: getToAccount?._id, transactionType: 0, currency: currency?.symbol });
            if (wallet) {
                newTransaction.walletAddress = wallet?.address;
            }
            const transaction_ = await newTransaction.save();

            if (getFromAccount && parseFloat(getFromAccount.amounts.find(element => element.currencyId.toString() == req.body.currencyId).amount) > parseFloat(req.body.amount)) { // 

                let updatefromUserAmounts = [...getFromAccount.amounts]
                let updateToUserAmounts = [...getToAccount.amounts]

                let updatedfromUserAmount = parseFloat(updatefromUserAmounts.find(element => element.currencyId.toString() == req.body.currencyId).amount) - parseFloat(req.body.amount)
                let updatedToUserAmount = parseFloat(updateToUserAmounts.find(element => element.currencyId.toString() == req.body.currencyId).amount) + parseFloat(req.body.amount)

                updatefromUserAmounts.find(element => element.currencyId.toString() == req.body.currencyId).amount = updatedfromUserAmount;
                updateToUserAmounts.find(element => element.currencyId.toString() == req.body.currencyId).amount = updatedToUserAmount;

                let toFilter = { _id: getToAccount._id };
                let toUpdate = { amounts: updateToUserAmounts }
                let fromFilter = { _id: getFromAccount._id };
                let fromUpdate = { amounts: updatefromUserAmounts }
                let updateToAmount = await Account.findOneAndUpdate(toFilter, { $set: toUpdate })
                let updateFromAmount = await Account.findOneAndUpdate(fromFilter, { $set: fromUpdate })
                res.status(200).json({ success: true, message: "Transaction successfull", transaction_ })
            } else {
                res.status(403).json({ success: false, message: "You don't have enough balance", transaction_ })
            }
        } else {
            res.status(403).json({ success: false, message: "Person you want to send balance does not exists" })
        }
        // Save the updated transaction object

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/transaction/{id}
// @desc Returns a specific transaction
// @access Public
exports.show = async function (req, res) {

    const transaction = await Transaction.aggregate([
        {
            $match: {
                _id: ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'fromAccount',
                foreignField: '_id',
                as: 'fromAccount'
            }
        },
        {
            $unwind: "$fromAccount"
        },
        {
            $lookup: {
                from: 'users',
                localField: 'toAccount',
                foreignField: '_id',
                as: 'toAccount'
            }
        },
        {
            $unwind: "$toAccount"
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'currencyId',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $unwind: "$currencies"
        },
        {
            $limit: 1
        },
    ])

    res.status(200).json({ success: true, message: "List of users associated with transaction", transaction })
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ message: 'Transaction has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminDeposits = async function (req, res) {
    const adminDeposits = await Transaction.find({ userId: ObjectId(req.params.id), transactionType: { $ne: true } })
    res.status(200).json({ success: true, message: "List of transactions", adminDeposits })
};

exports.getAdminWithdraws = async function (req, res) {
    const adminWithdraws = await Transaction.find({ userId: ObjectId(req.params.id), transactionType: { $ne: false } })
    res.status(200).json({ success: true, message: "List of transactions", adminWithdraws })
};

exports.completeAllTransactions = async function (req, res) {
    try {
        await Transaction.updateMany({}, { $set: { isResolved: 1 } });
        res.status(200).json({ message: 'All Transactions has been resolved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.sellShort = async function (req, res) {
    // 
}