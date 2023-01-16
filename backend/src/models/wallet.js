const mongoose = require('mongoose');


const WalletSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    currencyId: {
        type: mongoose.Types.ObjectId,
        ref: 'Currency',
        trim: true
    },
    name: {
        type: String,
        required: 'Wallet name is required',
        trim: true
    },
    address: {
        type: String,
        required: 'Wallet address is required',
        trim: true
    },
    privateKey: {
        type: String,
        trim: true
    },
    isEVM: {
        type: Boolean,
        required: false,
        default: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Wallet', WalletSchema);