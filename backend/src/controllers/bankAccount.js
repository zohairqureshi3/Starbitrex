const BankAccount = require('../models/bankAccount')
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// @route GET api/card
// @desc Returns all bank-account
// @access Public
exports.index = async function (req, res) {
    const bankAccount = await BankAccount.find({ userId: req.params.userId });
    res.status(200).json({ success: true, message: "List of bank accounts", bankAccount })
};

// @route POST api/bank-account/add
// @desc Add a new bank-account
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated credit-card object
        let name = req.body.name.charAt(0).toString().toUpperCase() + req.body.name.substr(1, req.body.name.length)
        let iban = req.body.iban.charAt(0).toString().toUpperCase() + req.body.iban.substr(1, req.body.iban.length)
        let accountNumber = req.body.accountNumber.charAt(0).toString().toUpperCase() + req.body.accountNumber.substr(1, req.body.accountNumber.length)
        let bankAddress = req.body.bankAddress.charAt(0).toString().toUpperCase() + req.body.bankAddress.substr(1, req.body.bankAddress.length)
        let swiftCode = req.body.swiftCode.charAt(0).toString().toUpperCase() + req.body.swiftCode.substr(1, req.body.swiftCode.length)
        // let symbol = req.body.symbol.toString().toUpperCase()
        // let card = await CreditCard.findOne({ address: req.body.address });

        // if (card) {
        //     return res.status(401).json({ success: false, message: "Card already exists!" })
        // } else {
        // Save the updated network object
        const newBank = new BankAccount({ ...req.body });
        newBank.name = name;
        newBank.iban = iban;
        newBank.accountNumber = accountNumber;
        newBank.bankAddress = bankAddress;
        newBank.swiftCode = swiftCode;
        const bank_ = await newBank.save();
        const bankAccount = await BankAccount.find({ userId: req.body.userId });
        return res.status(200).json({ success: true, message: "Bank Account added successfully", bank_, bankAccount })
        // }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/bank-account/{id}
// @desc Returns a specific bank-account
// @access Public
exports.show = async function (req, res) {
    const currencies = await Currency.find().select('name _id symbol');
    const allBanks = await BankAccount.findById(req.params.id);
    res.status(200).json({ success: true, message: "List of Currencies associated with Bank", currencies, allBanks })
};

// @route PUT api/bank-account/{id}
// @desc Update bank-account details
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
        const bank = await BankAccount.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (card) return res.status(200).json({ card, message: 'Bank has been updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const find = await BankAccount.findById(id);
        const uid = find?.userId;
        await BankAccount.findByIdAndDelete(id);
        const bankAccount = await BankAccount.find({ userId: uid });
        return res.status(200).json({ success: true, message: "Bank Account has been deleted", bankAccount })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};