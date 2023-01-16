const mongoose = require('mongoose');
const AdminCommentSchema = new mongoose.Schema({

    id: Number,
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: 'Comment is required',
        trim: true
    },
    authorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('AdminComment', AdminCommentSchema);