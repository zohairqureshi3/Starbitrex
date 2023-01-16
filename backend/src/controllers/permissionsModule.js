const PermissionsModule = require('../models/permissionsModule');

// @route GET api/permissions-modules
// @desc Returns all permissions
// @access Public
exports.index = async function (req, res) {
    const permissionsModules = await PermissionsModule.find({ status: true });
    res.status(200).json({ success: true, message: "List of Permissions Modules", permissionsModules })
};

// @route POST api/permissions-module/add
// @desc Add a new permissions module
// @access Public
exports.store = async (req, res) => {
    try {
        const checkPermissionsModule = await PermissionsModule.findOne({ name: req.body.name });
        if (!checkPermissionsModule) {
            const newPermissionsModule = new PermissionsModule({ ...req.body });
            const permissionsModule_ = await newPermissionsModule.save();
            return res.status(200).json({ success: false, message: "Permissions module created successfully", permissionsModule_ })
        } else {
            return res.status(500).json({ success: false, message: "Permissions module already exists" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/permissions-module/{id}
// @desc Returns a specific permissions module
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const permissionsModule = await PermissionsModule.findById(id);
        if (!permissionsModule) return res.status(401).json({ message: 'Permissions module does not exist' });

        res.status(200).json({ permissionsModule });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route PUT api/permissions-module/{id}
// @desc Update permissions module detail
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const permissionsModule = await PermissionsModule.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (permissionsModule) return res.status(200).json({ permissionsModule, message: 'Permissions Module has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE api/permissions-module/{id}
// @desc Delete permissions module detail
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await PermissionsModule.findByIdAndDelete(id);
        res.status(200).json({ message: 'Permissions module has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/get-module-with-permissions
// @desc Get permissions module with associated permissions
// @access Public
exports.getModuleWithPermissions = async function (req, res) {
    try {
        const modulesWithPermissions = await PermissionsModule.aggregate([
            {
                $match: { status: true },
            },
            {
                $lookup: {
                    from: "permissions",
                    localField: "_id",
                    foreignField: "permissionModule",
                    as: "permissions",
                },
            }
        ]);
        res.status(200).json({ message: 'List of Modules with Permissions.', modulesWithPermissions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};