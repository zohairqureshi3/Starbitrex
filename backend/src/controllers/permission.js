const Permission = require('../models/permission');

// @route GET admin/permission
// @desc Returns all permissions
// @access Public
exports.index = async function (req, res) {
    const response = await Permission.find({ status: true });
    const permissions = response.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    });
    res.status(200).json({ success: true, message: "List of permissions", permissions })
};

// @route POST api/permission/add
// @desc Add a new permission
// @access Public
exports.store = async (req, res) => {
    try {
        const checkPermission = await Permission.findOne({ name: req.body.name });
        if (!checkPermission) {
            const newPermission = new Permission({ ...req.body });
            const permission_ = await newPermission.save();
            return res.status(200).json({ success: false, message: "Permission created successfully", permission_ })
        } else {
            return res.status(500).json({ success: false, message: "Permission already exists" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/permission/{id}
// @desc Returns a specific permission
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const permission = await Permission.findById(id);
        if (!permission) return res.status(401).json({ message: 'Permission does not exist' });

        res.status(200).json({ permission });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route PUT api/permission/{id}
// @desc Update permission details
// @access Public

exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const permission = await Permission.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (!req.file) return res.status(200).json({ permission, message: 'Permission has been updated' });
        const permission_ = await Permission.findByIdAndUpdate(id, { $set: update }, { $set: { profileImage: result.url } }, { new: true });
        if (!req.file) return res.status(200).json({ permission: permission_, message: 'Permission has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Permission.findByIdAndDelete(id);
        res.status(200).json({ message: 'Permission has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.destroyPermissions = async function (req, res) {
    try {
        const id = req.params.id;
        await Permission.deleteMany({
            "$or": [
                { "permissionModule": { "$exists": false } }
            ]
        })
        res.status(200).json({ message: 'Permissions without module have been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};