const AdminBankAccount = require('../models/adminBankAccount');

// @route GET api/admin-bank-account
// @desc Returns all Admin Bank Accounts
// @access Public
exports.index = async function (req, res) {
    const adminBankAccounts = await AdminBankAccount.find({ status: true });
    res.status(200).json({ success: true, message: "List of Bank Accounts", adminBankAccounts })
};

// @route POST api/admin-bank-account/add
// @desc Add a new Admin Bank Account
// @access Public
exports.store = async (req, res) => {
    try {
        const checkAdminBankAccount = await AdminBankAccount.findOne({ name: req.body.name, accountNumber: req.body.accountNumber });
        if (!checkAdminBankAccount) {
            const newAdminBankAccount = new AdminBankAccount({ ...req.body });
            const adminBankAccount_ = await newAdminBankAccount.save();
            return res.status(200).json({ success: false, message: "Bank Account created successfully", adminBankAccount_ })
        } else {
            return res.status(500).json({ success: false, message: "Bank Account already exists" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/admin-bank-account/{id}
// @desc Returns a specific Admin Bank Account
// @access Public
exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const adminBankAccount = await AdminBankAccount.findById(id);
        if (!adminBankAccount) return res.status(401).json({ message: 'Bank Account does not exist' });

        return res.status(200).json({ adminBankAccount });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route PUT api/admin-bank-account/{id}
// @desc Update Admin Bank Account detail
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const adminBankAccount = await AdminBankAccount.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (adminBankAccount) return res.status(200).json({ adminBankAccount, message: 'Bank Account has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT api/admin-bank-account/set-default
// @desc Set Default Admin Bank Account detail
// @access Public
exports.setDefaultBankAccount = async function (req, res) {
    try {
        const adminBankAccountDefault = await AdminBankAccount.updateMany({ isDefault: true }, { $set: { isDefault: false } });
        const update = req.body;
        const id = req.params.id;
        const newAdminBankAccountDefault = await AdminBankAccount.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (newAdminBankAccountDefault) return res.status(200).json({ newAdminBankAccountDefault, message: 'Bank Account has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET api/admin-bank-account/get-default
// @desc Get Default Admin Bank Account detail
// @access Public
exports.getDefaultBankAccount = async function (req, res) {
    try {
        const adminBankAccountDefault = await AdminBankAccount.findOne({ isDefault: true });
        if (adminBankAccountDefault) return res.status(200).json({ adminBankAccountDefault, message: 'Default Bank Account has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE api/admin-bank-account/{id}
// @desc Delete Admin Bank Account
// @access Public
exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const adminBankAccount = await AdminBankAccount.findByIdAndDelete(id);
        if (adminBankAccount)
            return res.status(200).json({ message: 'Bank Account has been deleted', adminBankAccount });
        else
            return res.status(500).json({ message: 'Something went wrong' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};