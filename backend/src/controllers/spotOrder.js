const SpotOrder = require("../models/spotOrder");
const User = require("../models/user");
const Account = require("../models/account");
const Currency = require('../models/currency');
const { sendEmail } = require('../utils/index');
const { spotOrderEmailTemplate } = require('../utils/emailtemplates/spotOrder');
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const https = require('https');

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.index = async function (req, res) {
    try {

        var search = {};
        if(req?.query?.status) {
            search =  {
                status: Number(req?.query?.status)
            }
        }

        const orders = await SpotOrder.aggregate([
            {
                $match: search
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
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
        ]).sort({ "created_at": -1 })
        res.status(200).json({ success: true, message: "All orders", orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route POST api/account/add
// @desc Add a new account
// @access Public
exports.store = async (req, res) => {
    try {
        const newOrder = new SpotOrder({ ...req.body });
        const data = { ...req.body };
        const user = await User.findById(data.userId);
        if (data.marketOrder == 1) {
            newOrder.status = 2;
            newOrder.isResolved = true;
        } else {
            newOrder.status = 1;
            newOrder.isResolved = false;
        }
        const account = await Account.findOne({ userId: data.userId })
        account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount) - parseFloat(data.userInvestedAmount);
        account.save();

        const order_ = await newOrder.save();

        if (order_) {
            // send response
            res.status(200).json({ success: true, message: "Spot order created successfully", order_ })

            let order_type = data.marketOrder == 0 ? 'Limit' : 'Market';
            let order_direction = data.tradeType == 1 ? 'Buy' : 'Sell';

            // send email
            let subject = "Created Spot Order";
            let to = user.email;
            let from = process.env.FROM_EMAIL;
            let fullName = user.firstName + ' ' + user.lastName;
            let headingMessage = 'Your spot order has been created successfully.';
            let orderDetails = { 'order_type': order_type, 'order_direction': order_direction, 'order_value': data.tradeEndPrice, 'order_value_symbol': data.fromCurrencySymbol, 'order_qty': data.investedQty, 'order_qty_symbol': data.toCurrencySymbol, 'order_price': data.tradeStartPrice, 'order_price_symbol': data.fromCurrencySymbol };

            let html = spotOrderEmailTemplate(headingMessage, fullName, orderDetails);

            await sendEmail({ to, from, subject, html });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route GET api/account/{id}
// @desc Returns a specific account
// @access Public
exports.show = async function (req, res) {
    try {
        const userOrderss = await SpotOrder.aggregate([
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
        const userOrders = userOrderss.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        });
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
        let data = { ...req.body }
        const leverageOrder = await SpotOrder.findById(data._id);
        if (leverageOrder) {
            let tradeEndPrice = 0;
            let maintainance = 1;

            if (data.tradeType == 0) {
                tradeEndPrice = (data.tradeStartPrice * data.leverage) / (data.leverage + 1 - (data.leverage * 0.01))
            } else {
                // buy
                tradeEndPrice = (data.tradeStartPrice * data.leverage) / (data.leverage - 1 + (data.leverage * 0.01))
            }

            data.tradeEndPrice = tradeEndPrice;

            const account = await Account.findOne({ userId: data.userId })

            account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).amount) - (0 - (parseFloat(leverageOrder.userInvestedAmount) - parseFloat(data.userInvestedAmount)));

            account.save();
            const leverageOrder_ = await SpotOrder.findByIdAndUpdate(data._id, data)
            res.status(200).json({ success: true, message: "Updated" });
        }
        else {
            res.status(200).json({ success: true, message: "Order Not Found" });
        }

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

exports.stop = async function (req, res) {
    try {
        const id = req.params.id;
        const spotOrder = await SpotOrder.findById(id);
        const user = await User.findById(spotOrder.userId);

        const account = await Account.findOne({ userId: spotOrder.userId.toString() });
        account.amounts.find(row => row.currencyId.toString() == spotOrder.fromCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == spotOrder.fromCurrency.toString()).amount) + parseFloat(spotOrder.userInvestedAmount);
        account.save();

        spotOrder.status = 3;
        spotOrder.isResolved = true;
        spotOrder.save();

        if (spotOrder) {
            res.status(200).json({ success: true, message: "Order is Stopped" });

            let order_type = spotOrder.marketOrder == 0 ? 'Limit' : 'Market';
            let order_direction = spotOrder.tradeType == 1 ? 'Buy' : 'Sell';
            const fromCurrency = await Currency.findById(spotOrder.fromCurrency).select({ "symbol": 1 });
            const toCurrency = await Currency.findById(spotOrder.toCurrency).select({ "symbol": 1 });

            // send email
            let subject = "Spot Order Stopped";
            let to = user.email;
            let from = process.env.FROM_EMAIL;
            let fullName = user.firstName + ' ' + user.lastName;
            let headingMessage = 'Your spot order has been stopped successfully.';
            let orderDetails = { 'order_type': order_type, 'order_direction': order_direction, 'order_value': spotOrder.tradeEndPrice, 'order_value_symbol': fromCurrency.symbol, 'order_qty': spotOrder.investedQty, 'order_qty_symbol': toCurrency.symbol, 'order_price': spotOrder.tradeStartPrice, 'order_price_symbol': fromCurrency.symbol };

            let html = spotOrderEmailTemplate(headingMessage, fullName, orderDetails);

            await sendEmail({ to, from, subject, html });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.complete = async function (req, res) {
    try {
        const id = req.params.id;
        const spotOrder = await SpotOrder.findById(id);
        const user = await User.findById(spotOrder.userId);

        const account = await Account.findOne({ userId: spotOrder.userId.toString() });
        var total = spotOrder.tradeType == 0 ? spotOrder.userInvestedAmount * spotOrder.tradeStartPrice : spotOrder.userInvestedAmount / spotOrder.tradeStartPrice;
        account.amounts.find(row => row.currencyId.toString() == spotOrder.toCurrency.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == spotOrder.toCurrency.toString()).amount) + parseFloat(total);
        account.save();

        spotOrder.status = 2;
        spotOrder.isResolved = true;
        spotOrder.save();
        if (spotOrder) {
            res.status(200).json({ success: true, message: "Order is Completed" });

            let order_type = spotOrder.marketOrder == 0 ? 'Limit' : 'Market';
            let order_direction = spotOrder.tradeType == 1 ? 'Buy' : 'Sell';
            const fromCurrency = await Currency.findById(spotOrder.fromCurrency).select({ "symbol": 1 });
            const toCurrency = await Currency.findById(spotOrder.toCurrency).select({ "symbol": 1 });

            // send email
            let subject = "Spot Order Completed";
            let to = user.email;
            let from = process.env.FROM_EMAIL;
            let fullName = user.firstName + ' ' + user.lastName;
            let headingMessage = 'Your spot order has been completed.';
            let orderDetails = { 'order_type': order_type, 'order_direction': order_direction, 'order_value': spotOrder.tradeEndPrice, 'order_value_symbol': fromCurrency.symbol, 'order_qty': spotOrder.investedQty, 'order_qty_symbol': toCurrency.symbol, 'order_price': spotOrder.tradeStartPrice, 'order_price_symbol': fromCurrency.symbol };

            let html = spotOrderEmailTemplate(headingMessage, fullName, orderDetails);

            await sendEmail({ to, from, subject, html });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.userOrders = async function (req, res) {
    try {
        const orders = await SpotOrder.aggregate([
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
        ]).sort({ "created_at": -1 })
        res.status(200).json({ success: true, message: "All orders", orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPendingOrders = async function (req, res) {
    try {
        const orders = await SpotOrder.aggregate([
            {
                $match: {
                    isResolved: { $ne: true }
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
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $unwind: '$fromCurrency'
            },
            {
                $unwind: '$toCurrency'
            }
        ]).sort({ "created_at": -1 })
        res.status(200).json({ success: true, message: "All orders", orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};