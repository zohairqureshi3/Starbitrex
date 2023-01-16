const TransactionManagement = require('../models/transactionManagement');
const Currency = require('../models/currency');
// const Permission = require('../models/permission');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/transactionManagement
// @desc Returns all transactionManagements
// @access Public
exports.index = async function (req, res) {

    const transactionManagements = await TransactionManagement.aggregate([
        {
            $lookup: {
                from: 'currencies',
                localField: 'currencyId',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $unwind: "$currencies"
        },
    ])

    res.status(200).json({ success: true, message: "List of transactionManagements", transactionManagements })
};

// @route POST api/transactionManagement/add
// @desc Add a new transactionManagement
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated transactionManagement object
        const getTransactionFee = await TransactionManagement.findOne({ currencyId: req.body.currencyId })
        if (!getTransactionFee) {
            const newTransactionManagement = new TransactionManagement({ ...req.body });
            const transactionManagement_ = await newTransactionManagement.save();
            res.status(200).json({ success: true, message: "Conversion Fee set successfully", transactionManagement_ })
        } else {
            res.status(500).json({ success: false, message: "Fee already set for this currency" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/transactionManagement/{id}
// @desc Returns a specific transactionManagement
// @access Public
exports.show = async function (req, res) {
    // const currency = await Currency.find().select('name symbol');
    const transactionManagement = await TransactionManagement.aggregate([
        {
            $match: {
                _id: ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'currencyId',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $unwind: "$currencies"
        },
        {
            $project: {
                "currencies._id": 1,
                "currencies.name": 1,
                "currencies.symbol": 1,
                "fee": 1
            }
        },
        {
            $limit: 1
        },
    ])

    res.status(200).json({ success: true, message: "List of permissions associated with Conversion Fee", transactionManagement })
};

// @route PUT api/transactionManagement/{id}
// @desc Update transactionManagement details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        // const transactionManagementId = req.transactionManagement._id;
        //Make sure the passed id is that of the logged in transactionManagement
        // if (transactionManagementId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        const transactionManagement = await TransactionManagement.findByIdAndUpdate(id, { $set: update }, { new: true });

        //if there is no image, return success message
        if (transactionManagement) return res.status(200).json({ transactionManagement, message: 'Conversion Fee updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await TransactionManagement.findByIdAndDelete(id);
        res.status(200).json({ message: 'Conversion Fee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFee = async function (req, res) {
    const transactionFee = await TransactionManagement.find({ currencyId: req.body.currencyIds })
    if (transactionFee)
        return res.status(200).json({ success: true, message: "TransactionFee Fetched", transactionFee })
    res.status(500).json({ success: false, message: "Fee not found for this currency and Network" })
};