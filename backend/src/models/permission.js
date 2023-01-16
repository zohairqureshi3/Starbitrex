const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({

    id: Number,
    name: {
        type: String,
        required: 'Permission name is required',
        trim: true
    },
    permissionModule: {
        type: mongoose.Types.ObjectId,
        ref: 'permissionsmodule',
        required: 'Permission Module is required',
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Permission', PermissionSchema);