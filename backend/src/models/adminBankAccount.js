const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminBankAccount = new Schema({

    id: Number,
    name: {
        type: String,
        required: 'Bank name is required',
        trim: true
    },
    iban: {
        type: String,
        required: 'Iban is required',
        trim: true
    },
    accountNumber: {
        type: String,
        required: 'Account Number is required',
        trim: true
    },
    bankAddress: {
        type: String,
        required: 'Bank Address is required',
        trim: true
    },
    swiftCode: {
        type: String,
        required: 'Swift Code is required',
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('AdminBankAccount', AdminBankAccount);