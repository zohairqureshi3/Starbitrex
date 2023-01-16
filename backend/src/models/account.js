const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: 'Account name is required',
        trim: true
    },
    previousTotalAmount: {
        type: Number,
        required: 'Previous Amount is required',
        trim: true,
        default: 0
    },
    amounts: [{
        currencyId: {
            type: mongoose.Types.ObjectId,
            ref: 'Currency',
            required: true,
        },
        amount: {
            type: Number,
            required: 'Amount is required',
            trim: true,
            default: 0
        },
        futures_amount: {
            type: Number,
            required: 'Fututres Amount is required',
            trim: true,
            default: 0
        }
    }],
    fiatAmounts: [{
        fiatCurrencyId: {
            type: mongoose.Types.ObjectId,
            ref: 'FiatCurrency',
            required: true,
        },
        amount: {
            type: Number,
            required: 'Amount is required',
            trim: true,
            default: 0
        }
    }],
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Account', AccountSchema);