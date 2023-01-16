const BlockchainBalance = require("../models/blockchainBalance");
const User = require("../models/user");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// @route GET admin/account
// @desc Returns all accounts
// @access Public
exports.index = async function (req, res) {};

// update account balance accounts of admin
exports.accountsAgainstId = async function (req, res) {};

// @route POST api/account/add
// @desc Add a new account
// @access Public
exports.store = async (req, res) => {};

// @route GET api/account/{id}
// @desc Returns a specific account
// @access Public
exports.show = async function (req, res) {};

// @route PUT api/account/{id}
// @desc Update account details
// @access Public
exports.update = async function (req, res) {};

exports.destroy = async function (req, res) {};

exports.transferAmounts = async function (req, res) {};
