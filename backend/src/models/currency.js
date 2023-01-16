const mongoose = require('mongoose');


const CurrencySchema = new mongoose.Schema({

    id: Number,
    name: {
        type: String,
        required: 'Currency name is required',
        trim: true
    },
    symbol: {
        type: String,
        required: 'Currency symbol is required',
        trim: true
    },
    address: { // Empty if Native currency, 
        type: String,
        required: false,
        default: "0"
    },
    type: { // Native or Token
        type: String,
        // required: 'Type is required, id it Naitve or a Token?',
        required: false,
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
        required: 'Color of currency is required',
        trim: true
    },
    isFiat: {
        type: Boolean,
        required: true,
        default: false
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

module.exports = mongoose.model('Currency', CurrencySchema);