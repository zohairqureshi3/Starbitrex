const Role = require('../models/role');
const Permission = require('../models/permission');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/role
// @desc Returns all roles
// @access Public
exports.index = async function (req, res) {

    const response = await Role.aggregate([
        {
            $lookup: {
                from: 'permissions',
                localField: 'permissionIds',
                foreignField: '_id',
                as: 'permissions'
            }
        },
        {
            $project: {
                name: 1, 'permissions.name': 1,
            }
        }
    ])
    const roles = response.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    });
    res.status(200).json({ success: true, message: "List of roles", roles })
};

// @route POST api/role/add
// @desc Add a new role
// @access Public
exports.store = async (req, res) => {
    try {


        // Save the updated role object
        const newRole = new Role({ ...req.body });
        const role_ = await newRole.save();
        res.status(200).json({ success: true, message: "Role created successfully", role_ })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/role/{id}
// @desc Returns a specific role
// @access Public
exports.show = async function (req, res) {
    const allPermissions = await Permission.find().select('name _id');
    const role = await Role.aggregate([
        {
            $match: {
                _id: ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'permissions',
                localField: 'permissionIds',
                foreignField: '_id',
                as: 'permissions'
            }
        },
        {
            $project: {
                "permissions.name": 1,
                "permissions._id": 1,
                "name": 1
            }
        },

        {
            $limit: 1
        },
    ])

    res.status(200).json({ success: true, message: "List of permissions associated with role", role, allPermissions })
};

// @route PUT api/role/{id}
// @desc Update role details
// @access Public
exports.update = async function (req, res) {

    try {
        const update = {
            permissionIds: req.body.permissionIds,
            name: req.body.name
        };
        const _id = req.params.id;
        // const roleId = req.role._id;
        //Make sure the passed id is that of the logged in role
        // if (roleId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        const role = await Role.findByIdAndUpdate(_id, { $set: update }, { new: true });

        //if there is no image, return success message
        return res.status(200).json({ role, message: 'Role has been updated' });

        // const role_ = await Role.findByIdAndUpdate(_id, { $set: update }, { $set: { profileImage: result.url } }, { new: true });

        // if (!req.file) return res.status(200).json({ role: role_, message: 'Role has been updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Role.findByIdAndDelete(id);
        res.status(200).json({ message: 'Role has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};