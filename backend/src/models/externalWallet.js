const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExternalWallet = new Schema({

    id: Number,
    name: {
        type: String,
        required: 'Wallet name is required',
        trim: true
    },
    symbol: {
        type: String,
        required: 'Wallet symbol is required',
        trim: true
    },
    address: {
        type: String,
        required: 'Wallet address is required',
        trim: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    currencyId: {
        type: mongoose.Types.ObjectId,
        ref: 'currency',
        required: true,
    },
    networkId: {
        type: mongoose.Types.ObjectId,
        ref: 'network',
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('ExternalWallet', ExternalWallet);