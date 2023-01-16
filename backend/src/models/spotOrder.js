const mongoose = require('mongoose');
const SpotOrderSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    tradeType: {
        type: Number, // 1=buy, 0=sell
        required: true,
        default: false
    },
    fromCurrency: {
        type: mongoose.Types.ObjectId,
        ref: 'Currency',
        required: true,
        trim: true
    },
    toCurrency: {
        type: mongoose.Types.ObjectId,
        ref: 'Currency',
        required: true,
        trim: true
    },
    tradeStartPrice: {
        type: Number,
        required: true,
        trim: true
    },
    tradeEndPrice: {
        type: Number,
        required: true,
        trim: true
    },
    marketOrder: {
        type: Number, // 1= Limit, 0=Market
        required: true,
        default: false
    },
    userInvestedAmount: {
        type: Number,
        required: true,
        trim: true
    },
    investedQty: {
        type: Number,
        required: true,
        trim: true
    },
    spotPair: {
        type: String,
        required: true,
        trim: true
    },
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    },
    tradingFeePaid: {
        type: Number,
        required: false,
    },
    status: {
        type: Number, // 1=Processing, 2=Completed, 3=Stopped/Cancelled
        required: true,
        default: 0,
        trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model('SpotOrder', SpotOrderSchema);