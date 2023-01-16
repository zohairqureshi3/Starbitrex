const mongoose = require('mongoose');


const LeverageSchema = new mongoose.Schema({

    id: Number,
    sourceCurrencyId: {
        type: mongoose.Types.ObjectId,
        ref: 'Currency',
        required: 'Leverage Source Currency is required',
    },
    destinationCurrencyId: {
        type: mongoose.Types.ObjectId,
        ref: 'Currency',
        required: 'Leverage Destination Currency is required'
    },
    fromAmount: {
        type: Number,
        required: 'From amount is required',
        trim: true
    },
    toAmount: {
        type: Number,
        required: 'To amount is required',
        trim: true
    },
    leverage: {
        type: Number,
        required: 'Leverage is required',
        trim: true
    },
    maintenanceMR: {
        type: Number,
        required: 'Maintenance margin rate is required',
        max: [100, 'Maintenance margin rate can not be greater than 100'],
        trim: true
    },
    maintenanceAmount: {
        type: Number,
        required: 'Maintenance amount is required',
        trim: true
    },
    leverageFee: {
        type: Number,
        required: 'Leverage fee is required',
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Leverage', LeverageSchema);