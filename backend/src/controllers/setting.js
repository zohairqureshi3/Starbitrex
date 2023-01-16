const Setting = require('../models/setting');
const Permission = require('../models/permission');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/setting
// @desc Returns all settings
// @access Public
exports.index = async function (req, res) {

    const settings = await Setting.findOne({}, { _id: 0 })

    res.status(200).json({ success: true, message: "List of settings", settings })
};

// @route POST api/setting/add
// @desc Add a new setting
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated setting object
        const newSetting = new Setting({ ...req.body });
        const setting_ = await newSetting.save();
        res.status(200).json({ success: true, message: "Setting created successfully", setting_ })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/setting/{id}
// @desc Returns a specific setting
// @access Public
exports.show = async function (req, res) {
    const allPermissions = await Permission.find().select('name _id');
    const setting = await Setting.aggregate([
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

    res.status(200).json({ success: true, message: "List of permissions associated with setting", setting, allPermissions })
};

// @route PUT api/setting/{id}
// @desc Update setting details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const setting_ = await Setting.findOneAndUpdate({ $set: update });

        return res.status(200).json({ setting: setting_, message: 'Setting has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Setting.findByIdAndDelete(id);
        res.status(200).json({ message: 'Setting has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};