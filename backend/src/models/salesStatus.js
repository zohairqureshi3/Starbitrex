const mongoose = require('mongoose');
const SalesStatusSchema = new mongoose.Schema({

    id: Number,
    name: {
        type: String,
        required: 'Sales status name is required',
        trim: true
    },
    color: {
        type: String,
        required: 'Color of sales status is required',
        trim: true
    },
    type: {
        type: Number, // 0=Sales, 1=Retention 3=Both(Sales+Retention)
        required: true,
        default: 0
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('SalesStatus', SalesStatusSchema);