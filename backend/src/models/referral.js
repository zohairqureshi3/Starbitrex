const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const Token = require('./token');

const UserSchema = new Schema({

    id: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // code: {
    //     type: String,
    //     unique: true,
    //     required: false,
    //     index: true,
    //     sparse: true
    // },
    refererId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    userType: {
        type: String,
        default: "Master",
        unique: false,
    },
    refCount: {
        type: Number,
        default: 0,
        unique: false,
    },
}, { timestamps: true });


module.exports = mongoose.model('Referral', UserSchema);