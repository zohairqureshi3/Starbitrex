const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    token: {
        type: String,
        required: true
    },

    tokenExpiresIn: {
        type: Date,
        default: Date.now,
        required: false
    },

    // expireAt: {
    //     type: Date,
    //     default: Date.now,
    //     index: { expires: '5m' },
    // },


}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);
