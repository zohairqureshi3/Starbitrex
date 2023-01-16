const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({

    id: Number,
    siteTitle: {
        type: String,
        trim: true
    },
    companyName: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        trim: true
    },
    companyRegistrationNumber: {
        type: String,
        trim: true
    },
    companyAddress: {
        type: String,
        trim: true
    },
    companyZipCode: {
        type: String,
        trim: true
    },
    companyCity: {
        type: String,
        trim: true
    },
    companyCountry: {
        type: String,
        trim: true
    },
    operatingHours: {
        type: String,
        trim: true
    },
    pinterest: {
        type: String,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    twitter: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    // ethNetwork: "", ethAddress: "", ethPercenage: "",
    // xrpNetwork: "", xrpAddress: "", xrpPercenage: "",
    // btcNetwork: "", btcAddress: "", btcPercenage: "",
    ethNetwork: {
        type: mongoose.Types.ObjectId,
        ref: 'networks',
        required: 'ETH network is required',
    },
    ethAddress: {
        type: String,
        trim: true
    },
    ethPercenage: {
        type: String,
        trim: true
    },
    xrpNetwork: {
        type: mongoose.Types.ObjectId,
        ref: 'networks',
        required: 'XRP network is required',
    },
    xrpAddress: {
        type: String,
        trim: true
    },
    xrpPercenage: {
        type: String,
        trim: true
    },
    btcNetwork: {
        type: mongoose.Types.ObjectId,
        ref: 'networks',
        required: 'BTC network is required',
    },
    btcAddress: {
        type: String,
        trim: true
    },
    btcPercenage: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Setting', SettingSchema);