const Network = require('../models/network');
const Currency = require('../models/currency');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/networks
// @desc Returns all networks
// @access Public
exports.index = async function (req, res) {
    const allNetworks = await Network.aggregate([
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
                name: 1, symbol: 1, 'currencies.name': 1, 'currencies._id': 1, 'currencies.symbol': 1
            }
        }
    ])
    res.status(200).json({ success: true, message: "List of networks", allNetworks })
};

// @route POST api/network/add
// @desc Add a new network
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated network object
        let name = req.body.name.charAt(0).toString().toUpperCase() + req.body.name.substr(1, req.body.name.length)
        let symbol = req.body.symbol.toString().toUpperCase()
        let network = await Network.findOne({ name }).exec();

        if (network) {
            return res.status(401).json({ success: false, message: "Network already exists!" })
        } else {
            // Save the updated network object
            const newNetwork = new Network({ ...req.body });
            newNetwork.name = name;
            newNetwork.symbol = symbol;
            const network_ = await newNetwork.save();
            return res.status(200).json({ success: true, message: "Network created successfully", network_ })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/network/{id}
// @desc Returns a specific network
// @access Public
exports.show = async function (req, res) {
    const currencies = await Currency.find().select('name _id symbol');
    const allNetworks = await Network.aggregate([
        {
            $match: {
                _id: ObjectId(req.params.id)
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
                "name": 1,
                "symbol": 1,
                "chainId": 1,
                "rpcURL": 1,
                "multicallAddress": 1,
                "type": 1,
                "explorerURL": 1,
                "isEVM": 1,
                "isTestnet": 1
            }
        },
        {
            $limit: 1
        },
    ]);
    res.status(200).json({ success: true, message: "List of Currencies associated with Network", currencies, allNetworks })
};

// @route PUT api/network/{id}
// @desc Update network details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        let symbol = req.body.symbol.toString().toUpperCase()
        // const networkId = req.network._id;
        //Make sure the passed id is that of the logged in network
        // if (networkId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        update.symbol = symbol;
        const network = await Network.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (network) return res.status(200).json({ network, message: 'Network has been updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const currency = await Currency.find({ networkId: ObjectId(id), status: true });

        if (currency?.length > 0) {
            res.status(422).json({ message: 'You can not delete this network because currency (or currencies) is associated with it.' });
        }
        else {
            await Network.findByIdAndDelete(id);
            res.status(200).json({ message: 'Network has been deleted' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};