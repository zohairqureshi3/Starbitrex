const LeverageOrder = require("../models/leverageOrder");
const User = require("../models/user");
const Account = require("../models/account");
const Currency = require('../models/currency');
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const https = require('https');
const Leverage = require("../models/leverage");

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.index = async function (req, res) {
    try {
        const orders = await LeverageOrder.aggregate([
            {
                $match: {
                    isResolved: true
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

const getUnrealizedPnL = (row, buyRate, sellRate) => {
    //{ ///* Unrealized P&L = buy => Contract Qty x [(1/Avg Entry Price) - (1/Last Traded Price)]  &  Sell => Contract Qty x [(1/Last Traded Price) - (1/Avg Entry Price)]*/ }
    let val = row?.tradeType == 1 ? //buy
        parseFloat(row?.qty) * (parseFloat(buyRate) - parseFloat(row?.tradeStartPrice))
        : //sell
        parseFloat(row?.qty) * (parseFloat(row?.tradeStartPrice) - parseFloat(sellRate))
    return val && !isNaN(val) ? val : 0;
}

const calculateLiquidationPrice = async (orderr, data, account) => {
    let side = 0
    if (orderr.tradeType == 0) {
        //sell
        side = -1
    } else {
        //buy
        side = 1
    }

    let wb = 0
    let tmm = 0
    let UNPL = 0
    if (orderr.marginType == 0) {
        // cross
        // wb = futures wallet balance + invested amount (in usdt )
        wb = (parseFloat(account.amounts.find(row => row.currencyId.toString() == orderr.fromCurrency.toString()).futures_amount) + parseFloat(orderr.userInvestedAmount))
        // tmm = maintainance margin of all pos except this one.
        // UNPL = unpl of all pos except this one.
        const otherOrders = await LeverageOrder.find({ userId: orderr.userId, status: 1 });
        otherOrders.forEach(ordr => {
            // tmm
            if (ordr.maintenanceMargin)
                tmm = tmm + parseFloat(ordr.maintenanceMargin)
            // UNPL
            UNPL = UNPL + getUnrealizedPnL(ordr, data.currentBuyRate, data.currentSellRate)
        })
    } else {
        // isolated
        // wb = invested amount in usdt
        wb = parseFloat(orderr.userInvestedAmount)
    }
    let lp =
        (wb - tmm + UNPL + orderr.maintenanceAmount
            -
            side
            *
            orderr.qty
            *
            orderr.tradeStartPrice
        )
        /
        (
            orderr.qty
            *
            (orderr.maintenanceMargin / 100)
            -
            side
            *
            orderr.qty
        )

    return parseFloat(lp);

}

const checkExistingOpen = async (data, account, creating = false) => {

    const orderExists = await LeverageOrder.findOne({ userId: data.userId, status: 1, fromCurrency: data.fromCurrency.toString(), toCurrency: data.toCurrency.toString(), tradeType: data.tradeType });
    if (((creating && data.marketOrder == 1) || !creating) && orderExists) {
        orderExists.marginType = data.marginType;
        orderExists.userInvestedAmount = parseFloat(orderExists.userInvestedAmount) + parseFloat(data.userInvestedAmount);
        orderExists.tradeStartPrice = ((parseFloat(orderExists.qty) * parseFloat(orderExists.tradeStartPrice)) + (parseFloat(data.qty) * parseFloat(data.tradeStartPrice))) / (parseFloat(orderExists.qty) + parseFloat(data.qty));
        orderExists.qty = parseFloat(orderExists.qty) + parseFloat(data.qty);
        orderExists.tradeEndPrice = await calculateLiquidationPrice(orderExists, data, account);
        if (!creating)
            orderExists.save();
        return orderExists;
    } else {
        if (creating) {
            const newOrder = new LeverageOrder(data);
            if (data.marketOrder == 1) {
                newOrder.status = 1;
                newOrder.triggered = true;
                newOrder.isResolved = true;
            }
            newOrder.tradeEndPrice = await calculateLiquidationPrice(newOrder, data, account);
            // newOrder.save();
            return newOrder;
        }
        else {
            return null
        }
    }
}

// @route POST api/account/add
// @desc Add a new account
// @access Public
exports.store = async (req, res) => {
    try {
        const data = { ...req.body };

        // if (parseFloat((parseFloat(data.qty) * parseFloat(data.tradeStartPrice)).toPrecision(4)) < parseFloat((parseFloat(data.userInvestedAmount) * parseFloat(data.leverage)).toPrecision(4))) {
        //     return res.status(500).json({ success: false, message: "Insufficient wallet balance (initial margin) to open a position." });
        // }

        const account = await Account.findOne({ userId: data.userId })
        var total = parseFloat(account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).futures_amount) - parseFloat(data.userInvestedAmount);
        account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).futures_amount = total > 0 ? total : 0;

        const newOrder = await checkExistingOpen(data, account, true)

        if (newOrder.tradeEndPrice <= 0) {
            res.status(500).json({ success: false, message: "Cannot create this order. Invested amount is too low, please invest more amount." });
        }
        else {
            account.save();
            const order_ = await newOrder.save();
            res.status(200).json({ success: true, message: "Order Created Successfully", order_ })
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
        const userOrderss = await LeverageOrder.aggregate([
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
        const leverageOrder = await LeverageOrder.findById(data._id);
        if (leverageOrder && (leverageOrder.status == 0 || leverageOrder.status == 1)) {

            if (parseFloat(data.tradeStartPrice) != parseFloat(leverageOrder.tradeStartPrice)) {
                data.tpsl = false;
                data.takeProfitPrice = 0;
                data.stopLossPrice = 0;
            }

            // if (parseFloat(data.qty) * parseFloat(data.tradeStartPrice) < (parseFloat(data.userInvestedAmount) * parseFloat(data.leverage))) {
            //     return res.status(500).json({ success: false, message: "Insufficient wallet balance (initial margin) to open a position." });
            // }

            const account = await Account.findOne({ userId: data.userId })
            var total = parseFloat(account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).futures_amount) - (0 - (parseFloat(leverageOrder.userInvestedAmount) - parseFloat(data.userInvestedAmount)));
            account.amounts.find(row => row.currencyId.toString() == data.fromCurrency.toString()).futures_amount = total > 0 ? total : 0;

            data.tradeEndPrice = await calculateLiquidationPrice(leverageOrder, data, account);

            if (data.tradeEndPrice <= 0) {
                res.status(500).json({ success: false, message: "Cannot update this order. Invested amount is too low, please invest more amount." });
            }
            else {
                account.save();
                const leverageOrder_ = await LeverageOrder.findByIdAndUpdate(data._id, data)
                res.status(200).json({ success: true, message: "Order Updated Successfully" });
            }

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
        const stopRate = req.body.stopRate; // Self Stop or auto stop after order processing has started .... 0 when order has not started processing yet 
        const autoStop = req.body.autoStop; // Liquidation price, Stop Loss, Take Profit, Trailing Stop

        const leverageOrder = await LeverageOrder.findById(id);
        console.log("leverageOrder by Farhan: ", leverageOrder);

        const leverage = await Leverage.findOne({ sourceCurrencyId: ObjectId(leverageOrder.fromCurrency.toString()), destinationCurrencyId: ObjectId(leverageOrder.toCurrency.toString()) });
        let startPrice = 0
        // if (leverageOrder.tradeType == 0) //sell
        //     startPrice = parseFloat(leverageOrder.tradeStartPrice)
        // else //buy
        //     startPrice = 1 / parseFloat(leverageOrder.tradeStartPrice)
        startPrice = parseFloat(leverageOrder.tradeStartPrice)
        // return admin's amount
        let admins = (((parseFloat(leverageOrder.leverage) * parseFloat(leverageOrder.userInvestedAmount)) - parseFloat(leverageOrder.userInvestedAmount)) * parseFloat(startPrice));
        // Add + parseFloat(leverage.leverageFee) fee to this later 

        // return user's amount
        // subtract admin's fee as well 

        const allCurrencies = await Currency.find();
        let primaryCoin = allCurrencies.find(row => row._id.toString() == leverageOrder.fromCurrency.toString())
        let secondaryCoin = allCurrencies.find(row => row._id.toString() == leverageOrder.toCurrency.toString())
        let rate = 0;
        if (stopRate && leverageOrder.status == 1) {
            rate = stopRate;
            if (autoStop)
                leverageOrder.status = 2;
            else
                leverageOrder.status = 3;
            leverageOrder.exitPrice = stopRate;

            // send this to user's account (coin)
            const account = await Account.findOne({ userId: leverageOrder.userId });
            // let returnInvestment = leverageOrder.tradeType == 1 ? parseFloat(leverageOrder.userInvestedAmount) : parseFloat(leverageOrder.userInvestedAmount) * parseFloat(leverageOrder.exitPrice)
            let val =
                (leverageOrder.tradeType == 1 ? //buy
                    parseFloat(leverageOrder.qty) * (parseFloat(leverageOrder.exitPrice) - parseFloat(leverageOrder.tradeStartPrice))
                    : //sell
                    parseFloat(leverageOrder.qty) * (parseFloat(leverageOrder.tradeStartPrice) - parseFloat(leverageOrder.exitPrice))
                )
            let total = parseFloat(account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount) + parseFloat(leverageOrder.userInvestedAmount) + parseFloat(val);
            account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount = total > 0 ? parseFloat(total) : 0;
            account.save();

            leverageOrder.tradeProfitOrLoss = parseFloat(parseFloat(val))


            // leverageOrder.tradingFeePaid = leverage.leverageFee;
            leverageOrder.isResolved = true;
            leverageOrder.save();

        }
        else if (leverageOrder.status == 0) {
            const account = await Account.findOne({ userId: leverageOrder.userId });
            let total = parseFloat(account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount) + parseFloat(leverageOrder.userInvestedAmount)
            account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount = total > 0 ? parseFloat(total) : 0;
            account.save();

            leverageOrder.status = 3;
            leverageOrder.exitPrice = 0;
            leverageOrder.tradeProfitOrLoss = 0
            leverageOrder.isResolved = true;
            leverageOrder.save();
        }
        res.status(200).json({ success: true, message: "Order Stopped Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.start = async function (req, res) {
    try {
        const id = req.params.id;
        const data = { ...req.body };

        const account = await Account.findOne({ userId: data.userId })
        const orderr = await checkExistingOpen(data, account)

        if (orderr) {
            await LeverageOrder.findByIdAndDelete(data._id);
        }
        else {
            if (data.status == 0) {
                const leverageOrder = await LeverageOrder.findById(data._id);
                leverageOrder.status = 1;
                leverageOrder.triggered = true;
                leverageOrder.isResolved = true;
                leverageOrder.save();
            }
        }

        res.status(200).json({ success: true, message: "Order Processing Started" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.userOrders = async function (req, res) {
    try {
        const orders = await LeverageOrder.aggregate([
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
        const orders = await LeverageOrder.aggregate([
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

exports.revertOrder = async function (req, res) {
    try {
        const id = req.params.id;
        const leverageOrder = await LeverageOrder.findById(id);
        if (leverageOrder) {
            const account = await Account.findOne({ userId: leverageOrder.userId });

            let total = await parseFloat(account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount) - parseFloat(leverageOrder.tradeProfitOrLoss);

            if (total < 0) {
                return res.status(200).json({ success: false, message: "You can't revert this as user has not enough balance" });
            }
            else {
                account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount = total > 0 ? parseFloat(total) : 0;
                account.save();
            }

            const leverageOrderDel = await LeverageOrder.findByIdAndDelete(id);
            return res.status(200).json({ success: false, message: "Order has been reverted successfully.", leverageOrder: leverageOrderDel });
        }
        else {
            return res.status(200).json({ success: false, message: "Order does not exist.", leverageOrder: leverageOrder });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.editHistoryOrder = async function (req, res) {
    try {

        const update = req.body;
        const id = req.params.id;
        const diffInProfitOrLoss = update.diffInProfitOrLoss;

        const leverageOrder = await LeverageOrder.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        );

        if (leverageOrder) {
            const account = await Account.findOne({ userId: leverageOrder.userId });

            let total = await parseFloat(account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount) - parseFloat(diffInProfitOrLoss);
            account.amounts.find(row => row.currencyId.toString() == leverageOrder.fromCurrency.toString()).futures_amount = total > 0 ? parseFloat(total) : 0;
            account.save();

            return res.status(200).json({ success: false, message: "Order has been updated successfully.", leverageOrder: leverageOrder });
        }
        else {
            return res.status(200).json({ success: false, message: "Order does not exist.", leverageOrder: leverageOrder });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}