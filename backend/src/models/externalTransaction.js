const mongoose = require('mongoose');


const ExternalTransactionSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    userAccountId: {
        type: mongoose.Types.ObjectId,
        ref: 'Account',
        trim: true
    },
    fromAddress: {
        type: String,
        required: 'fromAddress is required',
        trim: true
    },
    toAddress: {
        type: String,
        required: 'toAddress is required',
        trim: true
    },
    walletAddress: {
        type: String,
        trim: true
    },
    txHash: {
        type: String,
        required: false,
        trim: true
    },
    blockNumber: {
        type: Number,
        // required: 'blockNumber is required',
        trim: true
    },
    blockHash: {
        type: String,
        // required: 'blockNumber is required',
        trim: true
    },
    amount: {
        type: String,
        required: 'Amount is required',
        trim: true
    },
    withdrawFee: {
        type: Number
    },
    gasPrice: {
        type: String,
        required: false,
        trim: true
    },
    gasLimit: {
        type: String,
        // required: 'gasLimit is required',
        trim: true
    },
    currencyId: {
        type: mongoose.Types.ObjectId,
        required: false,
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
    isResolved: {
        type: Number, // 0=Pending, 1=Completed, 2=Declined
        required: true,
        default: false
    },
    transactionTime: {
        type: String,
        // required: true,
        trim: true
    },
    transactionType: {
        type: Boolean, // 0=Deposit, 1=Withdraw
        required: true,
        default: false
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
    transactionRequestBy: {
        //identify deposit request by front-end or from admin side. True= front-end,false= admin side
        type: Boolean,
        required: true,
        default: false
    },
    isReal: {
        type: Boolean, // 0=Fake, 1=Real
        required: false,
        default: 0
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
}, { timestamps: true });


module.exports = mongoose.model('ExternalTransaction', ExternalTransactionSchema);