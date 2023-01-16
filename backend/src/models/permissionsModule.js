const mongoose = require('mongoose');

const PermissionsModuleSchema = new mongoose.Schema({

    id: Number,
    name: {
        type: String,
        required: 'Module name is required',
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('PermissionsModule', PermissionsModuleSchema);