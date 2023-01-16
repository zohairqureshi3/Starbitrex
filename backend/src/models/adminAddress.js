const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminAddress = new Schema({

    id: Number,
    address: {
        type: String,
        required: 'Address is required',
        trim: true
    },
    currencyIds: {
        type: [mongoose.Types.ObjectId],
        required: 'Currency Id is required',
        trim: true
    },
    networkId: {
        type: mongoose.Types.ObjectId,
        required: 'Network is required'
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

module.exports = mongoose.model('AdminAddress', AdminAddress);