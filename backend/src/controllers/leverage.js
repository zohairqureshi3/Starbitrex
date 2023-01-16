const Leverage = require('../models/leverage');
const User = require('../models/user');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/leverage
// @desc Returns all leverages
// @access Public
exports.index = async function (req, res) {
    const leverages = await Leverage.aggregate([
        // sourceCurrencyId 
        // destinationCurrencyId
        {
            $lookup: {
                from: "currencies",
                localField: "sourceCurrencyId",
                foreignField: "_id",
                as: "sourceCurrency",
            },
        },
        {
            $unwind: "$sourceCurrency"
        },
        {
            $lookup: {
                from: "currencies",
                localField: "destinationCurrencyId",
                foreignField: "_id",
                as: "destinationCurrency",
            },
        },
        {
            $unwind: "$destinationCurrency"
        },
    ]);
    console.log("List of leverages", leverages);
    // res.status(200).json({ success: true, message: "List of leverages", leverages })
};

// @route POST api/leverage/add
// @desc Add a new leverage
// @access Public
exports.store = async (req, res) => {
    try {
        let data = { ...req.body };
        let leverage = null;
        // let leverage = await Leverage.findOne({ sourceCurrencyId: data.sourceCurrencyId, destinationCurrencyId: data.destinationCurrencyId });

        if (leverage) {
            return res.status(401).json({ success: false, message: "Leverage already exists!" })
        } else {
            // Save the updated leverage object
            const newLeverage = new Leverage({ ...data });
            const leverage_ = await newLeverage.save();
            return res.status(200).json({ success: true, message: "Leverage created successfully", leverage_ })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/leverage/{id}
// @desc Returns a specific leverage
// @access Public
exports.show = async function (req, res) {
    const leverages = await Leverage.find({ _id: req.params.id });
    res.status(200).json({ success: true, message: "Leverage fetched", leverages })
};

// @route PUT api/leverage/{id}
// @desc Update leverage details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const leverage = await Leverage.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (leverage) return res.status(200).json({ leverage, message: 'Leverage has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Leverage.findByIdAndDelete(id);
        res.status(200).json({ message: 'Leverage has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/leverage/currency/{id}
// @desc Returns a specific leverage details against currency
// @access Public
exports.leverageByCurrency = async function (req, res) {
    const leverages = await Leverage.aggregate([
        // sourceCurrencyId 
        // destinationCurrencyId
        {
            $match: { sourceCurrencyId: ObjectId(req.params.id) }
        },
        {
            $lookup: {
                from: "currencies",
                localField: "sourceCurrencyId",
                foreignField: "_id",
                as: "sourceCurrency",
            },
        },
        {
            $unwind: "$sourceCurrency"
        },
        {
            $lookup: {
                from: "currencies",
                localField: "destinationCurrencyId",
                foreignField: "_id",
                as: "destinationCurrency",
            },
        },
        {
            $unwind: "$destinationCurrency"
        }
    ]).exec();
    res.status(200).json({ success: true, message: "Leverage against currency fetched", leverages })
};


exports.leveragSourceUpdateByCurrency = async function (req, res) {
    try {
        const sourceid = req.params.sourceid;
        const replaceid = req.params.replaceid;
        let oka = await Leverage.updateMany({ sourceCurrencyId: ObjectId(sourceid) }, { $set: { sourceCurrencyId: ObjectId(replaceid) } });

        if (oka)
            res.status(200).json({ success: true, message: "Leverages changed", sourceid: sourceid, replaceid: replaceid })
        else
            res.status(200).json({ success: true, message: "fake" })
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};


exports.leveragDestinationUpdateByCurrency = async function (req, res) {
    try {
        const destid = req.params.destid;
        const replaceid = req.params.replaceid;
        let oka = await Leverage.updateMany({ destinationCurrencyId: ObjectId(destid) }, { $set: { destinationCurrencyId: ObjectId(replaceid) } });

        if (oka)
            res.status(200).json({ success: true, message: "Leverages changed", destid: destid, replaceid: replaceid })
        else
            res.status(200).json({ success: true, message: "fake" })
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};
