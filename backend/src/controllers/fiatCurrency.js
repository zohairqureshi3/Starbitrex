const FiatCurrency = require('../models/fiatCurrency');
const User = require('../models/user');
var mongoose = require('mongoose');
const Account = require('../models/account');
const ObjectId = mongoose.Types.ObjectId;

// @route GET api/fiat-currency
// @desc Returns all fiat currencies
// @access Public
exports.index = async function (req, res) {
    const allFiatCurrencies = await FiatCurrency.find({ status: true });
    return res.status(200).json({ success: true, message: "List of fiat currencies", allFiatCurrencies })
};

// @route POST api/fiat-currency/add
// @desc Add a new fiat currency
// @access Public
exports.store = async (req, res) => {
    try {
        let name = req.body.name.charAt(0).toString().toUpperCase() + req.body.name.substr(1, req.body.name.length);
        let symbol = req.body.symbol.toString().toUpperCase();
        let fiatCurrency = await FiatCurrency.findOne({ symbol }).exec();

        if (fiatCurrency) {
            return res.status(401).json({ success: false, message: "Fiat currency already exists!" });
        } else {
            // Save the updated fiat currency object
            const newfiatCurrency = new FiatCurrency({ ...req.body });
            if (req.file) {
                newfiatCurrency.currencyIcon = req.file.filename;
            }
            newfiatCurrency.name = name;
            newfiatCurrency.symbol = symbol;
            const currency_ = await newfiatCurrency.save();
            // Add new fiat currency to all user Accounts
            var fiatCurrencyAmount = { fiatCurrencyId: currency_._id, amount: "0" };
            var allAccounts = await Account.find({ status: true })
            allAccounts.forEach(async (acc) => {
                acc.fiatAmounts.push(fiatCurrencyAmount);
                acc.save();
            });

            return res.status(200).json({ success: true, message: "Fiat currency created successfully", currency_ })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/fiat-currency/{id}
// @desc Returns a specific fiat currency
// @access Public
exports.show = async function (req, res) {
    try {
        const fiatCurrency = await FiatCurrency.findOne({ _id: req.params.id });
        if (fiatCurrency) {
            return res.status(200).json({ success: true, message: "Fiat currency details", fiatCurrency });
        }
        else {
            return res.status(500).json({ success: false, message: 'Fiat currency does not exist.' });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route PUT api/fiat-currency/{id}
// @desc Update fiat currency details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        let symbol = req.body.symbol.toString().toUpperCase()
        // const currencyId = req.currency._id;
        //Make sure the passed id is that of the logged in fiat currency
        // if (currencyId.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the user to upd this data."});

        update.symbol = symbol;
        const fiatCurrency = await FiatCurrency.findByIdAndUpdate(id, { $set: update }, { new: true });
        // Add new fiat currency to all user Accounts if missing
        var fiatCurrencyAmount = { fiatCurrencyId: fiatCurrency._id.toString(), amount: "0" };
        var allAccounts = await Account.find({ status: true });
        allAccounts.forEach(async (acc) => {
            if (!acc.fiatAmounts.find(amounts => amounts.fiatCurrencyId == fiatCurrency._id.toString())) {
                acc.fiatAmounts.push(fiatCurrencyAmount);
                await acc.save();
            }
        });

        if (fiatCurrency)
            return res.status(200).json({ success: true, fiatCurrency, message: 'Fiat currency has been updated' });
        else
            return res.status(500).json({ success: false, message: 'Something went wrong.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @route DELETE api/fiat-currency/{id}
// @desc Delete specific fiat currency
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        // await FiatCurrency.findByIdAndDelete(id);
        const fiatCurrency = await FiatCurrency.findById(id);
        fiatCurrency.status = false;
        await fiatCurrency.save();
        if (fiatCurrency)
            return res.status(200).json({ success: true, message: 'Fiat currency has been deleted' });
        else
            return res.status(500).json({ success: false, message: 'Fiat currency does not exist.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};