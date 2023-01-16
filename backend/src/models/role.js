const mongoose = require('mongoose');


const RoleSchema = new mongoose.Schema({

    id: Number,
    name: {
        type: String,
        required: 'Role name is required',
        trim: true
    },
    permissionIds: {
        type: [mongoose.Types.ObjectId],
        ref: 'Permission',
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }

}, { timestamps: true });


module.exports = mongoose.model('Role', RoleSchema);