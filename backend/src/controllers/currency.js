const Currency = require('../models/currency');
const User = require('../models/user');
var mongoose = require('mongoose');
const Account = require('../models/account');
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/currency
// @desc Returns all currencys
// @access Public
exports.index = async function (req, res) {
    // const allCurrencies = await Currency.find({ status: true });
    const allCurrencies = await Currency.find();
    res.status(200).json({ success: true, message: "List of currencys", allCurrencies })
};

// @route POST api/currency/add
// @desc Add a new currency
// @access Public
exports.store = async (req, res) => {
    try {
        let name = req.body.name.charAt(0).toString().toUpperCase() + req.body.name.substr(1, req.body.name.length)
        let symbol = req.body.symbol.toString().toUpperCase()
        let currency = await Currency.findOne({ symbol }).exec();

        if (currency) {
            return res.status(401).json({ success: false, message: "Currency already exists!" })
        } else {
            // Save the updated currency object
            const newCurrency = new Currency({ ...req.body });
            if (req.file) {
                newCurrency.currencyIcon = req.file.filename
            }
            newCurrency.name = name;
            newCurrency.symbol = symbol;
            const currency_ = await newCurrency.save();
            // Add new currency to all user Accounts
            var currency_amount = { currencyId: currency_._id, amount: "0" }
            var allAccounts = await Account.find({ status: true })
            allAccounts.forEach(async (acc) => {
                acc.amounts.push(currency_amount);
                acc.save();
            });

            return res.status(200).json({ success: true, message: "Currency created successfully", currency_ })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/currency/{id}
// @desc Returns a specific currency
// @access Public
exports.show = async function (req, res) {
    // const allCurrencies = await Currency.find({ _id: req.params.id });
    const allCurrencies = await Currency.findOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: "List of all currencies", allCurrencies })
};

// @route PUT api/currency/{id}
// @desc Update currency details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        let symbol = req.body.symbol.toString().toUpperCase()
        // const currencyId = req.currency._id;
        //Make sure the passed id is that of the logged in currency
        // if (currencyId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the user to upd this data."});

        update.symbol = symbol;
        const currency = await Currency.findByIdAndUpdate(id, { $set: update }, { new: true });
        // Add new currency to all user Accounts if missing
        var currency_amount = { currencyId: currency._id.toString(), amount: "0" }
        var allAccounts = await Account.find({ status: true })
        allAccounts.forEach(async (acc) => {
            if (!acc.amounts.find(amounts => amounts.currencyId == currency._id.toString())) {
                acc.amounts.push(currency_amount);
                acc.save();
            }
        });

        if (currency) return res.status(200).json({ currency, message: 'Currency has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        // await Currency.findByIdAndDelete(id);
        const currency = await Currency.findById(id);
        currency.status = false;
        currency.save();
        res.status(200).json({ message: 'Currency has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};