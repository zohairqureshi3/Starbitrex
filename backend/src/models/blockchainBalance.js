const mongoose = require('mongoose');


const BlockchainBalance = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    walletId: {
        type: mongoose.Types.ObjectId,
        ref: 'Wallet',
        required: false
    },
    currencyId: {
        type: mongoose.Types.ObjectId,
        ref: 'Currency',
        required: false
    },
    networkId: {
        type: mongoose.Types.ObjectId,
        ref: 'Network',
        required: false
    },

    onChainBalance: {
        type: Number,
        required: 'On chain balance is required',
        default: 0
    },
    accountBalance: {
        type: Number,
        required: 'Account balance is required',
        default: 0
    },
    blockNumber: {
        type: Number,
        required: 'BlockNumber is required',
        default: 0
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('BlockchainBalance', BlockchainBalance);