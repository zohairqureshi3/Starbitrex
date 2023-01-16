const mongoose = require('mongoose');

const withdrawFeeSchema = new mongoose.Schema({

    id: Number,
    currencyId: {
        type: mongoose.Types.ObjectId,
        required: 'Currency Id is required',
        trim: true
    },
    networkId: {
        type: mongoose.Types.ObjectId,
        ref: 'network',
        required: true,
    },
    fee: {
        type: Number,
        required: 'Fee is required',
        trim: true
    },
    feeAdminWallet: {
        type: String,
        required: 'Admin Wallet is required',
        trim: true
    },
    actualFee: {
        type: Number,
        required: 'ActualFee is required',
        trim: true
    },
    min: {
        type: Number,
        required: 'Min is required',
        trim: true
    },
    max: {
        type: Number,
        required: 'Max is required',
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('withdrawFee', withdrawFeeSchema);