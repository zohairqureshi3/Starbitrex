const AdminAddress = require('../models/adminAddress');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET api/admin-address
// @desc Returns all Admin Addresses
// @access Public
exports.index = async function (req, res) {
    const adminAddresses = await AdminAddress.aggregate([
        {
            $match: {
                status: 1
            }
        },
        {
            $lookup: {
                from: 'networks',
                localField: 'networkId',
                foreignField: '_id',
                as: 'network'
            }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'currencyIds',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $project: {
                address: 1,
                "isDefault": 1,
                'network.name': 1,
                'network._id': 1,
                'network.symbol': 1,
                'currencies.name': 1,
                'currencies._id': 1,
                'currencies.symbol': 1
            }
        }
    ])

    return res.status(200).json({ success: true, message: "List of Admin Addresses", adminAddresses });
};

// @route GET api/network-admin-address
// @desc Returns all Admin Addresses
// @access Public
exports.networkAdminAddresses = async function (req, res) {
    const currencyId = req.params.currId;
    const networkId = req.params.netId;
    let adminAddresses = [];

    if(networkId && currencyId)
        adminAddresses = await AdminAddress.aggregate([
            {
                $match: {
                    status: 1,
                    networkId: ObjectId(networkId),
                    currencyIds: ObjectId(currencyId),
                }
            },
            {
                $lookup: {
                    from: 'networks',
                    localField: 'networkId',
                    foreignField: '_id',
                    as: 'network'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'currencyIds',
                    foreignField: '_id',
                    as: 'currencies'
                }
            },
            {
                $project: {
                    address: 1,
                    "isDefault": 1,
                    'network.name': 1,
                    'network._id': 1,
                    'network.symbol': 1,
                    'currencies.name': 1,
                    'currencies._id': 1,
                    'currencies.symbol': 1
                }
            }
        ])

    return res.status(200).json({ success: true, message: "List of Admin Addresses", adminAddresses });
};

// @route POST api/admin-address/add
// @desc Add a new Admin Address
// @access Public
exports.store = async (req, res) => {
    try {
        const checkAdminAddress = await AdminAddress.findOne({ address: req.body.address, networkId: req.body.networkId, currencyId: req.body.currencyId });
        if (!checkAdminAddress) {
            const newAdminAddress = new AdminAddress({ ...req.body });
            const adminAddress_ = await newAdminAddress.save();
            return res.status(200).json({ success: false, message: "Admin Address created successfully", adminAddress_ })
        } else {
            return res.status(500).json({ success: false, message: "Admin Adress already exists" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/admin-address/{id}
// @desc Returns a specific Admin Address
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;

        const adminAddress = await AdminAddress.aggregate([
            {
                $match: {
                    _id: ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'currencyIds',
                    foreignField: '_id',
                    as: 'currencies'
                }
            },
            {
                $project: {
                    "currencies.name": 1,
                    "currencies._id": 1,
                    "address": 1,
                    "networkId": 1,
                    "isDefault": 1,
                    "status": 1
                }
            },
            {
                $limit: 1
            },
        ]);

        if (!adminAddress) return res.status(401).json({ message: 'Bank Account does not exist' });

        return res.status(200).json({ adminAddress: adminAddress?.[0] });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route PUT api/admin-address/{id}
// @desc Update Admin Address detail
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const adminAddress = await AdminAddress.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (adminAddress) return res.status(200).json({ adminAddress, message: 'Admin Address has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/admin-address/set-default-network
// @desc Set Default Admin Address  detail
// @access Public
exports.setDefaultNetworkAdminAddress = async function (req, res) {
    try {
        const update = req.body;
        console.log('update', update)
        const id = req.params.id;
        await AdminAddress.updateMany(update, { $set: { isDefault: false } });
        const newAdminAddressDefault = await AdminAddress.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (newAdminAddressDefault) return res.status(200).json({ newAdminAddressDefault, message: 'Admin Address has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/admin-address/set-default
// @desc Set Default Admin Address  detail
// @access Public
exports.setDefaultAdminAddress = async function (req, res) {
    try {
        const adminAddressDefault = await AdminAddress.updateMany({ isDefault: true }, { $set: { isDefault: false } });
        const update = req.body;
        const id = req.params.id;
        const newAdminAddressDefault = await AdminAddress.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (newAdminAddressDefault) return res.status(200).json({ newAdminAddressDefault, message: 'Admin Address has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/admin-address/get-default
// @desc Get Default Admin Address Account detail
// @access Public
exports.getDefaultAdminAddress = async function (req, res) {
    try {
        const adminAddressDefault = await AdminAddress.findOne({ isDefault: true });
        if (adminAddressDefault) return res.status(200).json({ adminAddressDefault, message: 'Default Admin Address has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE api/admin-address/{id}
// @desc Delete Admin Bank Account
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const adminAddress = await AdminAddress.findByIdAndDelete(id);
        if (adminAddress)
            return res.status(200).json({ message: 'Address has been deleted', adminAddress });
        else
            return res.status(500).json({ message: 'Something went wrong' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
