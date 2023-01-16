const ExternalFiatTransaction = require('../models/externalFiatTransaction');
const Referral = require('../models/transaction');

const User = require('../models/user');
const Account = require('../models/account');
const Currency = require('../models/currency');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Wallet = require('../models/wallet');

const creditCard = require('../models/creditCard');
const notification = require('../../_helpers/helper')

// @route GET admin/externalTransaction
// @desc Returns all transactions
// @access Public
// exports.index = async function (req, res) {

exports.index = async function (req, res) {
    const externalFiatTransactions = await ExternalFiatTransaction.find({});
    res.status(200).json({ success: true, message: "List of transactions", externalFiatTransactions })
};

// @route POST api/transaction/add
// @desc Add a new transaction
// @access Public

exports.store = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/transaction/{id}
// @desc Returns a specific transaction
// @access Public
exports.show = async function (req, res) {
    const transaction = await ExternalFiatTransaction.aggregate([
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
                localField: 'toCard',
                foreignField: '_id',
                as: 'toCard'
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

exports.getUserFiatTransactions = async function (req, res) {
    const externalFiatTransactions = await ExternalFiatTransaction.find({ userId: ObjectId(req.params.id) })
    res.status(200).json({ success: true, message: "List of transactions", externalFiatTransactions })
};

// exports.getUserDeposits = async function (req, res) {
//     const deposits = await ExternalTransaction.find({ userId: ObjectId(req.params.id), transactionType: { $ne: true } })
//     res.status(200).json({ success: true, message: "List of transactions", deposits })
// };

exports.getUserFiatWithdraws = async function (req, res) {
    const withdraws = await ExternalFiatTransaction.find({ userId: ObjectId(req.params.id), transactionType: 1 })
    res.status(200).json({ success: true, message: "List of transactions", withdraws })
};

// function financialMfil(numMfil) {
//     return Number.parseFloat(numMfil / 1e3).toFixed(3);
// }

exports.withdrawToExternalFiatCard = async function (req, res) {
    try {
        const data = req.body;
        const currency = await Currency.findOne({ _id: data.currencyId });
        const wallet = await Wallet.findOne({ userId: data.userId, currencyId: data.currencyId })

        let requestedAmount = data.coins.toString() ? data.coins.toString() : "0";
        let insertExternalFiatTransaction = new ExternalFiatTransaction({
            userId: data.userId,
            fromAddress: wallet ? wallet?.address : "",
            toCard: data.sendToCard,
            currencyId: currency?._id,
            // walletAddress: wallet ? wallet?.address : "",
            amount: requestedAmount,
            // withdrawFee: data.fee,
            // gasPrice: data.gas ? (data.gas).toString() : '21000',
            currency: currency.symbol,
            isResolved: 0,
            transactionType: 1, //outbound
            extras: JSON.stringify({ deducted: data.deducted })
        })
        const saveExternalFiatTransaction = await insertExternalFiatTransaction.save();

        //create logs for transaction
        let getUser = await User.findById(data.userId);
        notification.addUserLogs({
            userId: data.userId,
            module: 'WithdrawCardPayment',
            message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has created Card withdraw request ${requestedAmount} ${currency.symbol}`,
            isRead: false,
            redirectUrl: `/user-detail/${data.userId}`
        });

        return res.status(200).json({ message: "Withdraw submitted. Waiting for approval from Admin." });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.getPendingFiatTransactions = async function (req, res) {

    const pendingFiatTransactions = await ExternalFiatTransaction.aggregate([
        {
            $match: {
                isResolved: { $ne: true }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
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
    ])

    res.status(200).json({ success: true, message: "List of Pending transactions", pendingFiatTransactions })
};

exports.resolveWithDrawFiatTransaction = async function (req, res) {
    try {
        const id = req.params.id;
        const resolvedStatus = req.body.resolvedStatus;
        const additionalInfo = req.body.additionalInfo;

        const externalFiatTransaction = await ExternalFiatTransaction.findById(id);

        if (externalFiatTransaction) {
            if (resolvedStatus == 1) {
                let getAccountData = await Account.findOne({ "amounts.currencyId": ObjectId(externalFiatTransaction.currencyId), userId: ObjectId(externalFiatTransaction.userId) });
                let specificAccountData = getAccountData.amounts.find(amounts => amounts.currencyId == externalFiatTransaction.currencyId.toString());

                if ((specificAccountData.amount - externalFiatTransaction.amount) < 0) {
                    return res.status(200).json({ message: 'User does not have enough amount to be withdrawn.', status: 2 });
                }
                else {
                    const result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(externalFiatTransaction.currencyId), userId: ObjectId(externalFiatTransaction.userId) }, { $inc: { "amounts.$.amount": -externalFiatTransaction.amount } }).exec();

                    if (!result)
                        return res.status(200).json({ message: 'Something went wrong', status: 2 });
                }
            }
            externalFiatTransaction.isResolved = resolvedStatus;
            externalFiatTransaction.additionalInfo = additionalInfo;
            const externalFiatTransaction_ = await externalFiatTransaction.save();
            return res.status(200).json({ message: 'Transaction has been updated successfully.', status: 1 });
        }
        else {
            return res.status(200).json({ message: 'Unable to find transaction.', status: 2 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};