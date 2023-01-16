const InternalOrderHistory = require("../models/internalOrderHistory");
const User = require("../models/user");
const Account = require("../models/account");
const Currency = require('../models/currency');
const { sendEmail } = require('../utils/index');
const { exchangeCurrencyEmailTemplate } = require('../utils/emailtemplates/exchangeCurrency');
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const notificationHelper = require('../../_helpers/helper')


// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.index = async function (req, res) {
    try {
        const currencies = await Currency.find({});
        const userOrders = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(req.params.id)
                }
            },
            {
                $lookup: {
                    from: 'internalorderhistories',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'internalOrders'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'internalorderhistories.fromCurrency',
                    foreignField: '_id',
                    as: 'fromCurrency'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: '_id',
                    foreignField: 'internalorderhistories.toCurrency',
                    as: 'toCurrency'
                }
            },
            { $sort: { createdAt: -1 } },
        ])
        res.status(200).json({ success: true, message: "User's orders", userOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST api/account/add
// @desc Add a new account
// @access Public
exports.store = async (req, res) => {
    try {
        const newOrder = new InternalOrderHistory({ ...req.body });
        const order_ = await newOrder.save();
        const user = await User.findById(order_.userId);
        const account = await Account.findOne({ userId: order_.userId });
        if (account) {
            account.amounts.find(row => row.currencyId.toString() == order_.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == order_.fromCurrency.toString()).amount) - parseFloat(order_.fromAmount);
            account.amounts.find(row => row.currencyId.toString() == order_.toCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == order_.toCurrency.toString()).amount) + parseFloat(order_.convertedAmount);
            account.save();
            order_.isResolved = true;
            order_.save();
        }


        //create logs for depost amount from admin side
        let getUser = await User.findById(order_.userId);
        const reqData = req.body;
        notificationHelper.addUserLogs({
            userId: order_.userId,
            module: 'UserExchange',
            message: `${getUser.firstName} `+  `${getUser.lastName} `+ ` requested convert ${reqData.fromCurrencySymbol} to  ${reqData.toCurrencySymbol}`,
            isRead: false,
            redirectUrl: `/user-detail/${order_.userId}`
        });

        // send email
        let subject = "Currency Exchange";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let fullName = user.firstName + ' ' + user.lastName;
        const data = req.body;
        let currencyDetails = { 'paid_amount': data.fromAmountWithoutFee, 'paid_currency': data.fromCurrencySymbol, 'received_amount': data.convertedAmount, 'received_currency': data.toCurrencySymbol, 'coversion_fee': data.coversionFee, 'exchange_rate': data.conversionRate };

        let html = exchangeCurrencyEmailTemplate(fullName, currencyDetails);

        await sendEmail({ to, from, subject, html });
        res.status(200).json({ success: true, message: "Order created successfully", order_ })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET api/account/{id}
// @desc Returns a specific account
// @access Public
exports.show = async function (req, res) {
    try {
        const userOrders = await InternalOrderHistory.aggregate([
            {
                $match: {
                    userId: ObjectId(req.params.id)
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'fromCurrency',
                    foreignField: '_id',
                    as: 'fromCurrency'
                }
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'toCurrency',
                    foreignField: '_id',
                    as: 'toCurrency'
                }
            },
            {
                $unwind: '$fromCurrency'
            },
            {
                $unwind: '$toCurrency'
            }
        ])
        res.status(200).json({ success: true, message: "User's orders", userOrders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};

// @route PUT api/account/{id}
// @desc Update account details
// @access Public
exports.update = async function (req, res) {
    try {
        res.status(200).json({ success: true, message: "Update is Pending" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.destroy = async function (req, res) {
    try {
        res.status(200).json({ success: true, message: "Delete is Pending" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cron Job Internal Conversion
exports.resolveOrders = async function () {
    try {
        const orders = await InternalOrderHistory.find({ isResolved: false }).select({ "fromCurrency": 1, "toCurrency": 1, "fromAmount": 1, "convertedAmount": 1, 'userId': 1 });
        orders.forEach(async (order) => {
            const account = await Account.findOne({ userId: order.userId });
            if (account) {
                account.amounts.find(row => row.currencyId.toString() == order.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == order.fromCurrency.toString()).amount) - parseFloat(order.fromAmount);
                account.amounts.find(row => row.currencyId.toString() == order.toCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == order.toCurrency.toString()).amount) + parseFloat(order.convertedAmount)
                account.save();
                order.isResolved = true;
                order.save();
            }
        })
        console.log({ success: true, message: "Orders Resolved", orders: orders });
    } catch (error) {
        console.log({ message: error.message });
    }
};