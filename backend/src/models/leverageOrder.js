const mongoose = require('mongoose');
const LeverageOrderSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },
    marginType: {
        type: Number, // 0=cross, 1=isolated
        required: true,
        default: false
    },
    pairName: {
        type: String, // pairname
        required: true,
        default: ""
    },
    futuresOrder: {
        type: Number, // 0=spot, 1=futures
        required: true,
        default: false
    },
    tpsl: {
        type: Boolean, // 0=false, 1=true
        required: true,
        default: false
    },
    tradeType: {
        type: Number, // 1=buy, 0=sell
        required: true,
        default: false
    },
    marketOrder: {
        type: Number, // 2= conditional 1= market 0= limit
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
    qty: {
        type: Number,
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
    tradeTrailingPrice: {
        type: Number,
        required: false,
        trim: true,
        default: null
    },
    takeProfitPrice: {
        type: Number,
        required: false,
        trim: true
    },
    tradeTrailingDifference: {
        type: Number,
        required: false,
        trim: true,
        default: 0
    },
    stopLossPrice: {
        type: Number,
        required: false,
        trim: true
    },
    userInvestedAmount: {
        type: Number,
        required: true,
        trim: true
    },
    leverage: {
        type: Number,
        required: true,
        trim: true
    },
    maintenanceMargin: {
        type: Number,
        required: true,
        trim: true
    },
    maintenanceAmount: {
        type: Number,
        required: true,
        trim: true
    },
    tradeProfitOrLoss: {
        type: Number,
        required: false,
        default: 0
    },
    exitPrice: {
        type: Number,
        required: false,
        trim: true,
        default: 0
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
    triggered: {
        type: Boolean,
        required: false,
        default: false
    },
    // stopReason: {
    //     type: String,
    //     required: false,
    // },
    status: {
        type: Number, // 0=Created, 1=Processing, 2=Completed, 3=Stopped
        required: true,
        default: 0,
        trim: true
    }

}, { timestamps: true });


module.exports = mongoose.model('LeverageOrder', LeverageOrderSchema);