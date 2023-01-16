const SalesStatus = require('../models/salesStatus');

// @route GET api/sales-status
// @desc Returns all Sales Statuses
// @access Public
exports.index = async function (req, res) {
    const salesStatuses = await SalesStatus.find({ status: true });
    res.status(200).json({ success: true, message: "List of Statuses", salesStatuses })
};

// @route POST api/sales-status/add
// @desc Add a new Sales Status
// @access Public
exports.store = async (req, res) => {
    try {
        const checkSalesStatus = await SalesStatus.findOne({ name: req.body.name });
        if (!checkSalesStatus) {
            const newSalesStatus = new SalesStatus({ ...req.body });
            const salesStatus_ = await newSalesStatus.save();
            return res.status(200).json({ success: false, message: "Status created successfully", salesStatus_ })
        } else {
            return res.status(500).json({ success: false, message: "Status already exists" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/sales-status/{id}
// @desc Returns a specific Sales Status
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const salesStatus = await SalesStatus.findById(id);
        if (!salesStatus) return res.status(401).json({ message: 'Status does not exist' });

        res.status(200).json({ salesStatus });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route PUT api/sales-status/{id}
// @desc Update Sales Status detail
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const salesStatus = await SalesStatus.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (salesStatus) return res.status(200).json({ salesStatus, message: 'Status has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE api/sales-status/{id}
// @desc Delete Sales Status detail
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const salesStatus = await SalesStatus.findByIdAndDelete(id);
        if (salesStatus)
            return res.status(200).json({ message: 'Status has been deleted', salesStatus });
        else
            return res.status(500).json({ message: 'Something went wrong' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};