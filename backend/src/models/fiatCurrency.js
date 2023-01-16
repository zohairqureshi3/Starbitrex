const mongoose = require('mongoose');


const FiatCurrencySchema = new mongoose.Schema({

    id: Number,
    name: {
        type: String,
        required: 'Fiat currency name is required',
        trim: true
    },
    symbol: {
        type: String,
        required: 'Fiat currency symbol is required',
        trim: true
    },
    address: {
        type: String,
        required: false,
        default: "0"
    },
    contract: {
        type: String,
        required: false,
    },
    decimal: {
        type: String,
        // required: 'Decimal is required',
        required: false,
    },
    minAmount: {
        type: Number,
        required: 'Min amount is required',
        trim: true,
        default: 0
    },
    maxAmount: {
        type: Number,
        required: 'Max amount is required',
        trim: true,
        default: 0
    },
    conversionFee: {
        type: Number,
        required: 'Conversion fee is required',
        trim: true
    },
    color: {
        type: String,
        required: 'Color of fiat currency is required',
        trim: true
    },
    isFiat: {
        type: Boolean,
        required: true,
        default: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
    // currencyIcon: {
    //     type: String,
    //     required: false,
    //     max: 255
    // }
}, { timestamps: true });

module.exports = mongoose.model('FiatCurrency', FiatCurrencySchema);