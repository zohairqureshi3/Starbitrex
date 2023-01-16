const WithdrawFee = require('../models/withdrawFee');
const Currency = require('../models/currency');
// const Permission = require('../models/permission');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/withdrawFee
// @desc Returns all withdrawFees
// @access Public
exports.index = async function (req, res) {

    const withdrawFees = await WithdrawFee.aggregate([
        {
            $lookup: {
                from: 'currencies',
                localField: 'currencyId',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $lookup: {
                from: 'networks',
                localField: 'networkId',
                foreignField: '_id',
                as: 'networks'
            }
        },
        {
            $unwind: "$currencies"
        },
        {
            $unwind: "$networks"
        },
    ])

    res.status(200).json({ success: true, message: "List of withdrawFees", withdrawFees })
};

// @route POST api/withdrawFee/add
// @desc Add a new withdrawFee
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated withdrawFee object
        const getTransactionFee = await WithdrawFee.findOne({ currencyId: req.body.currencyId, networkId: req.body.networkId })
        if (!getTransactionFee) {
            const newWithdrawFee = new WithdrawFee({ ...req.body });
            const withdrawFee_ = await newWithdrawFee.save();
            res.status(200).json({ success: true, message: "Transaction Fee set successfully", withdrawFee_ })
        } else {
            res.status(500).json({ success: false, message: "Fee already set for this currency and Network" })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/withdrawFee/{id}
// @desc Returns a specific withdrawFee
// @access Public
exports.show = async function (req, res) {
    // const currency = await Currency.find().select('name symbol');
    const withdrawFee = await WithdrawFee.aggregate([
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
            $lookup: {
                from: 'networks',
                localField: 'networkId',
                foreignField: '_id',
                as: 'networks'
            }
        },
        {
            $unwind: "$currencies"
        },
        {
            $unwind: "$networks"
        },
        {
            $limit: 1
        },
    ])

    res.status(200).json({ success: true, message: "List of permissions associated with transactionFee", withdrawFee })
};

// @route PUT api/withdrawFee/{id}
// @desc Update withdrawFee details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        // const withdrawFeeId = req.withdrawFee._id;
        //Make sure the passed id is that of the logged in withdrawFee
        // if (withdrawFeeId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        const withdrawFee = await WithdrawFee.findByIdAndUpdate(id, { $set: update }, { new: true });

        //if there is no image, return success message
        if (withdrawFee) return res.status(200).json({ withdrawFee, message: 'Transaction Fee updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await WithdrawFee.findByIdAndDelete(id);
        res.status(200).json({ message: 'Transaction Fee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFee = async function (req, res) {
    const withdrawFee = await WithdrawFee.findOne({ currencyId: req.body.currencyId, networkId: req.body.networkId })
    if (withdrawFee)
        return res.status(200).json({ success: true, message: "TransactionFee Fetched", withdrawFee })
    res.status(500).json({ success: false, message: "Fee not found for this currency and Network" })
};