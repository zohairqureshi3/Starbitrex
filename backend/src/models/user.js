const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Token = require('../models/token');

const UserSchema = new Schema({

    id: Number,
    email: {
        type: String,
        unique: true,
        required: 'Your email is required',
        trim: true
    },

    username: {
        type: String,
        unique: true,
        // required: 'Username is required',
        required: false,
        trim: true
    },

    password: {
        type: String,
        required: 'Your password is required',
        max: 100
    },

    firstName: {
        type: String,
        required: 'First Name is required',
        max: 100
    },

    lastName: {
        type: String,
        required: 'Last Name is required',
        max: 100
    },
    countryId: {
        type: mongoose.Types.ObjectId,
        ref: 'Country',
    },
    salesStatusId: {
        type: mongoose.Types.ObjectId,
        ref: 'salesstatus',
    },
    clientType: {
        type: Number, // 1=Lead, 2=Client 3=Affiliate
        required: true,
        default: 1,
    },
    clientStatus: {
        type: Number, // 1=New, 2=Call Back, 3=Follow Up, 4=No Answer, 5=Deposited, 6=Not interested
        required: true,
        default: 1,
    },
    countryCode: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: 'Phone number is required',
        max: 15,
        unique: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    additionalInfo: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false,
        max: 255
    },

    mnemonic: {
        type: String,
        required: false,
        default: ''
    },

    profileImage: {
        type: String,
        required: false,
        max: 255
    },
    roleId: {
        type: mongoose.Types.ObjectId,
        default: ObjectId('623d57a1a2b65bb0813b9d2b'),
        ref: 'Role',
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'User',
    },
    defaultManager: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'User',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    status: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    otpCode: {
        type: String,
        default: ""
    },
    otpStatus: {
        type: Boolean,
        default: false,
    },
    secret: {
        type: String,
        required: false
    },
    qrCode: {
        type: String,
        required: false
    },
    privateKey: {
        type: String,
        required: false,
        default: ''
    },
    lastLoginAt: {
        type: Date
    },
    isLogin: {
        type: Boolean,
        default: false,
    },
    affialiateToken: {
        type: String,
        default: ''
    },
    affialiateId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.createPassword = function (newPassword) {
    const user = this;
    // if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        // if (err) return next(err);
        if (err) {
            throw new Error(err);
        }

        bcrypt.hash(newPassword, salt, function (err, hash) {
            if (err) {
                throw new Error(err);
            }

            user.password = hash

            // next();
        });
    });
}

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    let payload = {
        id: this._id,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generateAffiliateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 365);
    let payload = {
        id: this._id,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

UserSchema.methods.generateVerificationToken = function () {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex'),
        tokenExpiresIn: Date.now() + 7200000 //expires in 2 hours
    };

    return new Token(payload);
};

module.exports = mongoose.model('User', UserSchema);