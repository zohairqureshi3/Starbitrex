const mongoose = require('mongoose');


const ExternalBTCTransactionSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        trim: true
    },
    fromAddress: {
        type: String,
        trim: true
    },
    toAddress: {
        type: String,
        required: 'toAddress is required',
        trim: true
    },
    txId: {
        type: String,
        required: false,
        trim: true
    },
    blockHeight: {
        type: Number,
        required: 'blockHeight is required',
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
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    },
    transactionTime: {
        type: String,
        // required: true,
        trim: true
    },
    transactionType: {
        type: Boolean,  // 0: Inbound , 1: Outbound 
        required: true,
        default: false
    },
    transactionStatus: {
        type: Boolean,  // 0: pending , 1: confirmed 
        required: true,
        default: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    extras: {
        type: String,
        required: false
    }

}, { timestamps: true });


module.exports = mongoose.model('ExternalBTCTransaction', ExternalBTCTransactionSchema);