const Account = require('../models/account');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Role = require('../models/role');
const Currency = require('../models/currency');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const axios = require("axios");

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.index = async function (req, res) {

    res.status(200).json({ success: true, message: "List of data required on dashboard" })
};


exports.getAdminBalance = async function (req, res) {
    let name = "Admin"
    const adminRole = await Role.findOne({ name }, '_id');
    const currencies = await Currency.find({}, '_id, name');
    const dashboardInfo = await Account.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $match: {
                'users.roleId': adminRole._id
            }
        },

        {
            $lookup: {
                from: 'currencies',
                localField: 'amounts.currencyId',
                foreignField: '_id',
                as: 'currencies'
            }
        },
        {
            $lookup: {
                from: 'fiatcurrencies',
                localField: 'fiatAmounts.fiatCurrencyId',
                foreignField: '_id',
                as: 'fiatcurrencies'
            }
        },

        {
            $match: {
                'users.roleId': adminRole._id
            }
        },

        {
            $unwind: "$users"
        },
        {
            $project: {
                name: 1,
                amounts: 1,
                fiatAmounts: 1,
                'currencies._id': 1,
                'currencies.name': 1,
                'currencies.symbol': 1,
                'fiatcurrencies._id': 1,
                'fiatcurrencies.name': 1,
                'fiatcurrencies.symbol': 1,
            }
        }
    ])
    res.status(200).json({ success: true, message: "List of data required on dashboard", dashboardInfo })
};

exports.adminSentAmountToUser = async (req, res) => {
    try {
        let name = "Admin"
        const adminRole = await Role.findOne({ name }, '_id');
        const response = await Transaction.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromAccount',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            // {
            //     $match:{
            //         'users.roleId': adminRole._id
            //     }
            // },
            {
                $unwind: "$fromAccount"
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'toAccount',
                    foreignField: '_id',
                    as: 'toAccount'
                }
            },
            {
                $unwind: "$toAccount"
            },
            {
                $lookup: {
                    from: 'currencies',
                    localField: 'currencyId',
                    foreignField: '_id',
                    as: 'currencies'
                }
            },
            {
                $unwind: "$currencies"
            },
            {
                $project: {
                    'amount': 1,
                    'fromAccount.firstname': 1,
                    'fromAccount.lastname': 1,
                    'fromAccount.username': 1,
                    'fromAccount.email': 1,
                    'fromAccount._id': 1,
                    'toAccount._id': 1,
                    'toAccount.firstName': 1,
                    'toAccount.lastname': 1,
                    'toAccount.username': 1,
                    'toAccount.email': 1,
                    'currencies.name': 1,
                    'currencies.symbol': 1,
                    'createdAt': 1
                }
            }
        ]);
        const transactions = response.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        });
        res.status(200).json({ success: true, message: "List of transactions", transactions })
    } catch (e) {
        res.status(500).json({ success: false, message: "Something went wrong" })
    };
};

// exports.adminSentAmountToUser = async (req, res) => {
//     try {
//         let { page, limit } = req.query
//         page = page !== undefined && page !== '' ? parseInt(page) : 1
//         limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10
//         let name = "Admin"
//         const adminRole = await Role.findOne({ name }, '_id');

//         const response = await Transaction.aggregate([
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'fromAccount',
//                     foreignField: '_id',
//                     as: 'users'
//                 }
//             },
//             // {
//             //     $match:{
//             //         'users.roleId': adminRole._id
//             //     }
//             // },
//             {
//                 $unwind: "$fromAccount"
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'toAccount',
//                     foreignField: '_id',
//                     as: 'toAccount'
//                 }
//             },
//             {
//                 $unwind: "$toAccount"
//             },
//             {
//                 $lookup: {
//                     from: 'currencies',
//                     localField: 'currencyId',
//                     foreignField: '_id',
//                     as: 'currencies'
//                 }
//             },
//             {
//                 $unwind: "$currencies"
//             },
//             {
//                 $project: {
//                     'amount': 1,
//                     'fromAccount.firstname': 1,
//                     'fromAccount.lastname': 1,
//                     'fromAccount.username': 1,
//                     'fromAccount.email': 1,
//                     'fromAccount._id': 1,
//                     'toAccount._id': 1,
//                     'toAccount.firstName': 1,
//                     'toAccount.lastname': 1,
//                     'toAccount.username': 1,
//                     'toAccount.email': 1,
//                     'currencies.name': 1,
//                     'currencies.symbol': 1,
//                     'createdAt': 1
//                 }
//             },
//             { $sort: { _id: -1 } },
//             { $skip: limit * (page - 1) },
//             { $limit: limit },
//         ]);
//         const total = await Transaction.countDocuments()

//         const transactions = response.sort((a, b) => {
//             return new Date(b.createdAt) - new Date(a.createdAt)
//         });
//         res.status(200).json({
//             success: true, message: "List of transactions", transactions, pagination: {
//                 page, limit, total,
//                 pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
//             }
//         })
//     } catch (e) {
//         res.status(500).json({ success: false, message: "Something went wrong" })
//     };
// };