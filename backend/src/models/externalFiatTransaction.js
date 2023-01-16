const mongoose = require('mongoose');


const ExternalFiatTransactionSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    currencyId: {
        type: mongoose.Types.ObjectId,
        required: 'Currency Id is required',
        trim: true
    },
    fromAddress: {
        type: String,
        required: false,
        default: "0"
    },
    toCard: {
        type: String,
        required: 'toCard is required',
        trim: true
    },
    // walletAddress: {
    //     type: String,
    //     trim: true
    // },
    amount: {
        type: String,
        required: 'Amount is required',
        trim: true
    },
    // withdrawFee: {
    //     type: Number
    // },
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
    status: {
        type: Boolean,
        required: true,
        default: true
    },
}, { timestamps: true });


module.exports = mongoose.model('ExternalFiatTransaction', ExternalFiatTransactionSchema);