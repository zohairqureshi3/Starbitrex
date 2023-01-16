const CreditCard = require('../models/creditCard')
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET api/card
// @desc Returns all credit-card
// @access Public
exports.index = async function (req, res) {
    const creditCard = await CreditCard.find({ userId: req.params.userId });
    res.status(200).json({ success: true, message: "List of credit cards", creditCard })
};

// @route POST api/credit-card/add
// @desc Add a new credit-card
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated credit-card object
        let name = req.body.name.charAt(0).toString().toUpperCase() + req.body.name.substr(1, req.body.name.length)
        // let symbol = req.body.symbol.toString().toUpperCase()
        // let card = await CreditCard.findOne({ address: req.body.address });

        // if (card) {
        //     return res.status(401).json({ success: false, message: "Card already exists!" })
        // } else {
        // Save the updated network object
        const newCard = new CreditCard({ ...req.body });
        newCard.name = name;
        // newCard.symbol = symbol;
        const card_ = await newCard.save();
        const creditCard = await CreditCard.find({ userId: req.body.userId });
        return res.status(200).json({ success: true, message: "Card added successfully", card_, creditCard })
        // }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/credit-card/{id}
// @desc Returns a specific credit-card
// @access Public
exports.show = async function (req, res) {
    const currencies = await Currency.find().select('name _id symbol');
    const allCards = await CreditCard.findById(req.params.id);
    res.status(200).json({ success: true, message: "List of Currencies associated with Card", currencies, allCards })
};

// @route PUT api/credit-card/{id}
// @desc Update credit-card details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        let symbol = req.body.symbol.toString().toUpperCase()
        // const external_card_id = req.external_card._id;
        // Make sure the passed id is that of the logged in external-card
        // if (external_cardId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        update.symbol = symbol;
        const card = await CreditCard.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (card) return res.status(200).json({ card, message: 'Card has been updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const find = await CreditCard.findById(id);
        const uid = find?.userId;
        await CreditCard.findByIdAndDelete(id);
        const creditCard = await CreditCard.find({ userId: uid });
        return res.status(200).json({ success: true, message: "Card has been deleted", creditCard })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};