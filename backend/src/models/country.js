const mongoose = require('mongoose');
const CountrySchema = new mongoose.Schema({

    id: Number,
    name: {
        type: String,
        required: 'Country name is required',
        trim: true
    },
    nicename: {
        type: String,
        required: 'Country nice name is required',
        trim: true
    },
    iso: {
        type: String,
        required: 'Country ISO is required',
        trim: true
    },
    iso3: {
        type: String,
        required: 'Country ISO3 is required',
        trim: true
    },
    numcode: {
        type: String,
        required: 'Country numcode is required',
        trim: true
    },
    phonecode: {
        type: String,
        required: 'Country phonecode is required',
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Country', CountrySchema);