const ExternalWallet = require('../models/externalWallet');
const Network = require('../models/network');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET api/wallet
// @desc Returns all external-wallet
// @access Public
exports.index = async function (req, res) {
    const externalWallet = await ExternalWallet.find({ userId: req.params.userId });
    res.status(200).json({ success: true, message: "List of external wallets", externalWallet })
};

// @route POST api/external-wallet/add
// @desc Add a new external-wallet
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated external-wallet object
        let name = req.body.name.charAt(0).toString().toUpperCase() + req.body.name.substr(1, req.body.name.length)
        let symbol = req.body.symbol.toString().toUpperCase()
        // let wallet = await ExternalWallet.findOne({ address: req.body.address });

        // if (wallet) {
        //     return res.status(401).json({ success: false, message: "Wallet already exists!" })
        // } else {
        // Save the updated network object
        const newWallet = new ExternalWallet({ ...req.body });
        newWallet.name = name;
        newWallet.symbol = symbol;
        const wallet_ = await newWallet.save();
        const externalWallet = await ExternalWallet.find({ userId: req.body.userId });
        return res.status(200).json({ success: true, message: "Wallet added successfully", wallet_, externalWallet })
        // }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/external-wallet/{id}
// @desc Returns a specific external-wallet
// @access Public
exports.show = async function (req, res) {
    const currencies = await Currency.find().select('name _id symbol');
    const allWallets = await ExternalWallet.findById(req.params.id);
    res.status(200).json({ success: true, message: "List of Currencies associated with Wallets", currencies, allWallets })
};

// @route PUT api/external-wallet/{id}
// @desc Update external-wallet details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        let symbol = req.body.symbol.toString().toUpperCase()
        // const external_wallet_id = req.external_wallet._id;
        // Make sure the passed id is that of the logged in external-wallet
        // if (external_walletId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        update.symbol = symbol;
        const wallet = await ExternalWallet.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (wallet) return res.status(200).json({ wallet, message: 'Wallet has been updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const find = await ExternalWallet.findById(id);
        const uid = find?.userId;
        await ExternalWallet.findByIdAndDelete(id);
        const externalWallet = await ExternalWallet.find({ userId: uid });
        return res.status(200).json({ success: true, message: "Wallet has been deleted", externalWallet })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};