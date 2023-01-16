const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema({

    id: Number,

    fromAccount: {
        type: mongoose.Types.ObjectId,
        // required: 'fromAccount address is required',
        trim: true
    },
    toAccount: {
        type: mongoose.Types.ObjectId,
        // required: 'toAccount address is required',
        trim: true
    },
    amount: {
        type: String,
        required: 'Amount is required',
        trim: true
    },
    currency: {
        type: String,
        required: 'Currency is required',
        trim: true
    },
    additionalInfo: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: 'User Id is required',
        trim: true
    },
    currencyId: {
        type: mongoose.Types.ObjectId,
        required: 'Currency Id is required',
        trim: true
    },
    walletAddress: {
        type: String,
        trim: true
    },
    userAccountId: {
        type: mongoose.Types.ObjectId,
        required: 'Account Id of user is required',
        trim: true
    },
    transactionType: {
        type: Boolean, // 0=Deposit, 1=Withdraw
        required: true,
        default: 0
    },
    isReal: {
        type: Boolean, // 0=Fake, 1=Real
        required: true,
        default: 0
    },
    balanceType: {
        type: Boolean, // 0=Balance, 1=Credit
        required: true,
        default: 0
    },
    isResolved: {
        type: Number, // 0=Pending, 1=Completed, 2=Declined
        required: true,
        default: false
    },
    addedBy: {
        type: mongoose.Types.ObjectId,
        required: false,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Transaction', TransactionSchema);