const Country = require('../models/country');
const countriesJSON = require('../config/countries.json')

// @route GET api/countries
// @desc Returns all countries
// @access Public
exports.index = async function (req, res) {
    const countries = await Country.find({ status: true });
    res.status(200).json({ success: true, message: "List of Countries", countries })
};

// @route POST api/country/add
// @desc Add a new country
// @access Public
exports.store = async (req, res) => {
    try {
        const checkCountry = await Country.findOne({ name: req.body.name });
        if (!checkCountry) {
            const newCountry = new Country({ ...req.body });
            const country_ = await newCountry.save();
            return res.status(200).json({ success: false, message: "Country created successfully", country_ })
        } else {
            return res.status(500).json({ success: false, message: "Country already exists" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/country/{id}
// @desc Returns a specific country
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const country = await Country.findById(id);
        if (!country) return res.status(401).json({ message: 'Country does not exist' });

        res.status(200).json({ country });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route PUT api/country/{id}
// @desc Update country detail
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const country = await Country.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (country) return res.status(200).json({ country, message: 'Country has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE api/country/{id}
// @desc Delete country detail
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Country.findByIdAndDelete(id);
        res.status(200).json({ message: 'Country has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route POST api/country/addCountries
// @desc Add new countries
// @access Public
exports.addCountries = async (req, res) => {
    try {
        const countries = await Country.insertMany(countriesJSON);
        if (countries) return res.status(200).json({ success: false, message: "Countries created successfully", countries })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};