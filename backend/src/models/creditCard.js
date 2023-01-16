const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditCard = new Schema({

    id: Number,
    name: {
        type: String,
        required: 'Wallet name is required',
        trim: true
    },
    // symbol: {
    //     type: String,
    //     required: false,
    // },
    card: {
        type: String,
        required: 'Card number is required',
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
    status: {
        type: Number,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('CreditCard', CreditCard);