const mongoose = require('mongoose');
const InternalOrderHistorySchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
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
    conversionRate: {
        type: Number,
        required: true,
        trim: true
    },
    fromAmount: {
        type: Number,
        required: true,
        trim: true
    },
    convertedAmount: {
        type: Number,
        required: true,
        trim: true
    },
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: Boolean, // 0=pending, 1=approved/success, 2=blocked
        required: true,
        default: true,
        trim: true
    }

}, { timestamps: true });


module.exports = mongoose.model('InternalOrderHistory', InternalOrderHistorySchema);