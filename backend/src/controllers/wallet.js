const Wallet = require('../models/wallet');
const Network = require('../models/network');
const User = require('../models/user');
const Account = require('../models/account');
const Currency = require('../models/currency');
const BlockchainBalance = require('../models/blockchainBalance');
const ExternalBTCTransaction = require('../models/externalBTCTransaction');

const mongoose = require('mongoose');
const Web3 = require("web3");
const ethNetwork = process.env.RINKEBY;
const bnbNetwork = process.env.BSCTESTNET;
const avaxNetwork = process.env.AVAXFUJITESTNET;
const trxNetwork = process.env.TRONTESTNET;
const { ethers } = require("ethers");
const ExternalTransaction = require('../models/externalTransaction');
const ObjectId = mongoose.Types.ObjectId;
const RippleAPI = require('ripple-lib').RippleAPI
var Tx = require('ethereumjs-tx');
const tokenAbi = require('../config/abi')
const axios = require('axios')
const config = require('../config/config');
const TronWeb = require('tronweb');
const TronGrid = require('trongrid');
const bitcore = require('bitcore-lib');
const bitcoreCash = require('bitcore-lib-cash');
const litecore = require('litecore-lib');
const doge = require('bitcore-lib-doge');

const infuraProvider = new ethers.providers.JsonRpcProvider(ethNetwork);
// @route GET admin/wallet
// @desc Returns all wallets
// @access Public
exports.index = async function (req, res) {
    const wallets = await Wallet.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $project: {
                name: 1,
                address: 1,
                'users.firstName': 1,
                'users.lastName': 1,
                'users.username': 1,
                'users.email': 1,
                'users.roleId': 1,
                'users.isVerified': 1
            }
        },
        { $unwind: '$users' }
    ])
    res.status(200).json({ success: true, message: "List of wallets", wallets })
};

// @route POST api/wallet/add
// @desc Add a new wallet
// @access Public
exports.store = async (req, res) => {
    try {
        // Save the updated wallet object
        const newWallet = new Wallet({ ...req.body });
        const wallet_ = await newWallet.save();
        res.status(200).json({ success: true, message: "Wallet created successfully", wallet_ })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};

// @route GET api/wallet/{id}
// @desc Returns a specific wallet
// @access Public
exports.show = async function (req, res) {

    const wallet = await Wallet.aggregate([
        {
            $match: {
                _id: ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $limit: 1
        },
    ])
    res.status(200).json({ success: true, message: "List of users associated with wallet", wallet })
};

// @route PUT api/wallet/{id}
// @desc Update wallet details
// @access Public
exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const wallet = await Wallet.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (!req.file) return res.status(200).json({ wallet, message: 'Wallet has been updated' });
        const wallet_ = await Wallet.findByIdAndUpdate(id, { $set: update }, { $set: { profileImage: result.url } }, { new: true });
        if (!req.file) return res.status(200).json({ wallet: wallet_, message: 'Wallet has been updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        await Wallet.findByIdAndDelete(id);
        res.status(200).json({ message: 'Wallet has been deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWallet = async function (req, res) {
    try {
        const network = await Network.findById(req.body.networkId);
        if (network?.isEVM) {
            const wallet = await Wallet.findOne({ userId: req.params.id, isEVM: true }, 'address')
            if (wallet) return res.status(200).json({ success: true, message: "Wallet fetched successfully", wallet })
            else return res.status(200).json({ success: false, message: "Wallet not found" })
        }
        else {
            const wallet = await Wallet.findOne({ userId: req.params.id, currencyId: req.body.currencyId }, 'address')
            if (wallet) return res.status(200).json({ success: true, message: "Wallet fetched successfully", wallet })
            else return res.status(200).json({ success: false, message: "Wallet not found" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cron job
exports.getETHWalletTransactions = async function (req, res) {
    try {
        const networks = await Network.findOne({ symbol: 'ETH' }, 'name, symbol');
        const query = {
            "$and": [
                {
                    "networkId": { $in: networks }
                }
            ]
        }
        const wallet = await Wallet.find(query, 'address')
        let provider = new ethers.providers.EtherscanProvider('rinkeby');
        let currentBlockNumber = await infuraProvider.getBlockNumber();
        let getHistoryPromises = []
        let transactionData = []
        let block2 = currentBlockNumber - (6 * 60 * 60 / 15)

        if (wallet && wallet.length > 0 && provider) {
            wallet.forEach((item, index) => {
                getHistoryPromises.push(
                    provider.getHistory(item.address, block2, currentBlockNumber)
                        .then(res => {
                            if (res && res.length > 0) {
                                transactionData.push(res)
                            }
                        })
                        .catch(err => {
                            console.log("getETHWalletTransactions err", err)
                        })
                )
            })
            res.status(200).json({ success: true, message: "Transaction Data: ", transactionData })
        }
        console.log({ message: "Completed" });
    } catch (error) {
        console.log({ message: error.message });
    }
};

// Get BTC external deposits
exports.getBTCWalletTransactions = async function (req, res) {
    try {
        const networks = await Network.findOne({ symbol: 'BTC' }, 'name, symbol');
        const query = {
            "$and": [
                {
                    "networkId": { $in: networks }
                }
            ]
        }
        const wallet = await Wallet.find(query);
        var allBTCTransactions = [];
        if (wallet && wallet.length > 0) {
            wallet.forEach(async (item, index) => {
                axios.get(`https://blockstream.info/testnet/api/address/${item.address}/txs`)
                    .then(res => {
                        res?.data?.forEach(async (tx, i) => {
                            let extTrans = await ExternalBTCTransaction.findOne({ txId: tx.txid });

                            if (!extTrans && tx?.status?.confirmed) {
                                let insertExternalBTCTransaction = new ExternalBTCTransaction({
                                    userId: item.userId,
                                    toAddress: item.address,
                                    txId: tx.txid,
                                    blockHeight: tx?.status?.block_height,
                                    amount: tx?.vout?.filter(currVout => currVout.scriptpubkey_address == item.address)?.[0]?.value,
                                    currency: 'BTC',
                                    transactionTime: tx?.status?.block_time,
                                    isResolved: false,
                                    transactionStatus: tx?.status?.confirmed,
                                    transactionType: 0 //inbound
                                })
                                allBTCTransactions.push(await insertExternalBTCTransaction.save());
                            }
                        })
                    })
                    .catch(err => {
                        // console.log("getBTCWalletTransactions err", err)
                    })
            })
        }
        res.status(200).json({ message: 'Completed BTC wallet transactions.', allBTCTransactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.resolveBTCAccountTransactions = async function (req, res) {
    const transactions = await ExternalBTCTransaction.find({ isResolved: false, transactionType: 0, transactionStatus: 1 }).select({ "toAddress": 1, "currency": 1, "amount": 1, "blockHeight": 1 });
    // Get current block height to be compared with the our transaction block height
    let currentBlockHeight = await axios.get(`https://blockstream.info/testnet/api/blocks/tip/height`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log('err', err);
        });

    if (transactions && transactions.length > 0) {
        try {
            for (let i = 0; i < transactions.length; i++) {
                const transBlockHeight = transactions[i].blockHeight;
                if (currentBlockHeight - transBlockHeight >= config.btcConfirmationsToResolve) {
                    const address = transactions[i].toAddress;
                    const currency_symbol = transactions[i].currency;
                    const currency = await Currency.findOne({ symbol: currency_symbol });
                    const wallet = await Wallet.findOne({ address: address }).select({ "networkId": 1, "userId": 1, "_id": 0 });
                    const userId = wallet.userId;
                    const account = await Account.findOne({ userId: userId })
                    account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) + parseFloat(transactions[i].amount);
                    account.save();
                    transactions[i].isResolved = 1;
                    transactions[i].save();
                }
            }
        } catch (error) {
            console.log({ message: error.message });
        }
    }
    res.status(200).json({ message: 'BTC account resolved.', currentBlockHeight: currentBlockHeight });
}

exports.getAVAXWalletTransactions = async function (req, res) {
    try {
        const networks = await Network.findOne({ symbol: 'ETH' }, 'name, symbol');
        const query = {
            "$and": [
                {
                    "networkId": { $in: networks }
                }
            ]
        }
        const wallet = await Wallet.find(query, 'address')
        const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
        let getHistoryPromises = []
        let transactionData = []
        if (wallet && wallet.length > 0) {
            wallet.forEach(async (item, index) => {
                getHistoryPromises.push(
                    axios.get(`https://api.covalenthq.com/v1/43113/address/${item.address}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&key=ckey_145e82830aec4e379cb3f6fe7be`)
                        .then(res => {
                            if (res && res.data.data.items.length > 0) {
                                transactionData.push(res.data.data.items)
                            }
                        })
                        .catch(err => {
                            console.log("getETHWalletTransactions err", err)
                        })
                )
            })
            Promise.all(getHistoryPromises)
                .then(async (res) => {
                    if (transactionData && transactionData.length > 0) {
                        for (let i = 0; i < transactionData.length; i++) {
                            for (let j = 0; j < transactionData[i].length; j++) {
                                let transData = transactionData[i][j];
                                let extTrans = await ExternalTransaction.findOne({ txHash: transData.tx_hash })
                                const wallet = await Wallet.findOne({ address: transData.to_address }).select({ "userId": 1 });
                                if (!extTrans && parseFloat(transData.value) > 0 && wallet) {
                                    var add_amount = await ethers.utils.formatEther(web3.utils.fromWei(transData.value, 'ether'));
                                    var add_gasPrice = await ethers.utils.formatEther(web3.utils.fromWei(transData.fees_paid, 'ether'));
                                    let insertExternalTransaction = new ExternalTransaction({
                                        userId: wallet.userId,
                                        fromAddress: transData.from_address,
                                        toAddress: transData.to_address,
                                        walletAddress: transData.toAddress,
                                        txHash: transData.tx_hash,
                                        blockNumber: transData.block_height,
                                        amount: add_amount ? add_amount : '0',
                                        gasPrice: add_gasPrice,
                                        currency: 'AVAX',
                                        transactionTime: transData.block_signed_at,
                                        isResolved: 0,
                                        transactionType: 0 //inbound
                                    })
                                    const saveExternalTransaction = await insertExternalTransaction.save();
                                }
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('getAVAXWalletTransactions err: ', err)
                })
        }
        console.log({ message: "Completed" });
    } catch (error) {
        console.log({ message: error.message });
    }
    return;
}


exports.getTRXWalletTransactions = async function (req, res) {
    try {
        const networks = await Network.findOne({ symbol: 'TRX' }, 'name, symbol');
        const query = {
            "$and": [
                {
                    "networkId": { $in: networks }
                }
            ]
        }
        const wallet = await Wallet.find(query, 'address')
        // const address = 'TCw48FYuarPt92LWJzucA3vXLgpenkZH2a';
        const options = {
            onlyTo: true,
            onlyConfirmed: true,
            limit: 100,
            orderBy: 'timestamp,asc',
            minBlockTimestamp: Date.now() - 60000 // from a minute ago to go on
        };
        let live = process.env.NETWORK_LIVE;
        let host = live ? 'https://api.trongrid.io' : 'https://api.shasta.trongrid.io'
        const tronWeb = new TronWeb({ fullHost: 'https://api.shasta.trongrid.io' });
        const tronGrid = new TronGrid(tronWeb);
        let getHistoryPromises = []
        let transactionData = []
        if (wallet && wallet.length > 0) {
            wallet.forEach(async (item, index) => {
                getHistoryPromises.push(
                    tronGrid.account.getTransactions(item.address, options)
                        .then(res => {
                            transactionData.push(res.data)
                        })
                        .catch(err => console.error(err))
                )
            })
            Promise.all(getHistoryPromises)
                .then(async (res) => {
                    if (transactionData && transactionData.length > 0) {
                        for (let i = 0; i < transactionData.length; i++) {
                            for (let j = 0; j < transactionData[i].length; j++) {
                                let transData = transactionData[i][j];
                                let to_addr = tronWeb.address.fromHex(transData.raw_data.contract[0].parameter.value.to_address)
                                let from_addr = tronWeb.address.fromHex(transData.raw_data.contract[0].parameter.value.owner_address)
                                let amount = parseInt(transData.raw_data.contract[0].parameter.value.amount) / 1000000
                                let extTrans = await ExternalTransaction.findOne({ txHash: transData.txID })
                                const wallet = await Wallet.findOne({ address: to_addr }).select({ "userId": 1 });
                                if (!extTrans && parseFloat(amount) > 0 && wallet) {
                                    let insertExternalTransaction = new ExternalTransaction({
                                        userId: wallet.userId,
                                        fromAddress: from_addr,
                                        toAddress: to_addr,
                                        walletAddress: to_addr,
                                        txHash: transData.txID,
                                        blockNumber: transData.blockNumber,
                                        amount: amount ? amount : '0',
                                        gasPrice: transData.net_fee / 100000,
                                        // gasLimit: add_gasLimit,
                                        currency: 'TRX',
                                        transactionTime: transData.raw_data.timestamp,
                                        isResolved: 0,
                                        transactionType: 0 //inbound
                                    })
                                    const saveExternalTransaction = await insertExternalTransaction.save();
                                }
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('getAVAXWalletTransactions err: ', err)
                })
        }
        console.log({ message: "Completed" });
    } catch (error) {
        console.log({ message: error.message });
    }
    return;
}

exports.resolveAccountTransactions = async function (req, res) {
    const transactions = await ExternalTransaction.find({ isResolved: 0, transactionType: 0 }).select({ "toAddress": 1, "currency": 1, "amount": 1 });
    if (transactions && transactions.length > 0) {
        try {
            for (let i = 0; i < transactions.length; i++) {
                const address = transactions[i].toAddress;
                const currency_symbol = transactions[i].currency;
                const currency = await Currency.findOne({ symbol: currency_symbol });
                const wallet = await Wallet.findOne({ address: address }).select({ "networkId": 1, "userId": 1, "_id": 0 });
                const userId = wallet.userId;
                const account = await Account.findOne({ userId: userId })
                account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) + parseFloat(transactions[i].amount);
                account.save();
                transactions[i].isResolved = 1;
                transactions[i].save();
            }
        } catch (error) {
            console.log({ message: error.message });
        }
    }
    console.log({ message: 'Completed' });
}

exports.createUserWallet = async (req, res) => {
    const networkId = req.body.network;
    const userId = req.body.user;
    const currencyId = req.body.currencyId;
    const network = await Network.findOne({ _id: networkId })
    const isEVM = network?.isEVM;
    const currency = await Currency.findOne({ _id: currencyId })
    const user = await User.findOne({ _id: userId })
    let live = process.env.NETWORK_LIVE;
    if (user && currency && currency.symbol == 'ETH') {
        // Creating ETH Wallet
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
            let ethAccount = web3.eth.accounts.create(web3.utils.randomHex(32));
            let ethWallet = web3.eth.accounts.wallet.add(ethAccount);
            const ethAddress = ethWallet.address;
            const ehtPrivateKey = ethWallet.privateKey;
            // #request the latest block number
            let latest_blocknumber = await web3.eth.getBlockNumber()
            const newWallet = await new Wallet({ userId: userId, address: ethAddress, privateKey: ehtPrivateKey, currencyId: currencyId, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        }
        catch (e) {
            console.log("ETH Connection Error!", e);
        }
    }
    else if (user && currency && (currency.symbol == 'BNB' || currency.symbol == 'TBNB')) {
        // Creating BNB Wallet
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(bnbNetwork));
            let bnbAccount = web3.eth.accounts.create(web3.utils.randomHex(32));
            let bnbWallet = web3.eth.accounts.wallet.add(bnbAccount);
            const bnbAddress = bnbWallet.address;
            const bnbPrivateKey = bnbWallet.privateKey;
            // #request the latest block number
            let latest_blocknumber = await web3.eth.getBlockNumber()
            const newWallet = await new Wallet({ userId: userId, address: bnbAddress, privateKey: bnbPrivateKey, currencyId: currencyId, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        }
        catch (e) {
            console.log("BNB Connection Error!", e);
        }
    }
    else if (user && currency && currency.symbol == 'AVAX') {
        // Creating AVAX Wallet
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(avaxNetwork));
            let avaxAccount = web3.eth.accounts.create(web3.utils.randomHex(32));
            let avaxWallet = web3.eth.accounts.wallet.add(avaxAccount);
            const avaxAddress = avaxWallet.address;
            const avaxPrivateKey = avaxWallet.privateKey;
            // #request the latest block number
            let latest_blocknumber = await web3.eth.getBlockNumber()
            const newWallet = await new Wallet({ userId: userId, address: avaxAddress, privateKey: avaxPrivateKey, currencyId: currencyId, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        }
        catch (e) {
            console.log("AVAX Connection Error!", e);
        }
    }
    else if (user && currency && currency.symbol == 'TRX') {
        // Creating TRX Wallet
        try {
            const fullNode = 'https://api.shasta.trongrid.io';
            const solidityNode = 'https://api.shasta.trongrid.io';
            const eventServer = 'https://api.shasta.trongrid.io';
            const createPrivateKey = '';
            const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, createPrivateKey);
            // create new account
            const account = await tronWeb.createAccount();
            const trxAddress = account?.address?.base58;
            const trxPrivateKey = account?.privateKey;
            // #request the latest block number
            let latest_blocknumber = 0;
            const newWallet = await new Wallet({ userId: userId, address: trxAddress, privateKey: trxPrivateKey, currencyId: currencyId, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        }
        catch (e) {
            console.log("TRX Connection Error!", e);
        }
    }
    else if (user && currency && currency.symbol == 'BTC') {
        // Creating BIT Wallet
        try {
            let createBTCPrivateKey = new bitcore.PrivateKey('testnet');
            let btcPrivateKey = createBTCPrivateKey.toWIF();
            let btcAddress = new bitcore.PrivateKey(btcPrivateKey).toAddress();
            let latest_blocknumber = await axios("https://api.blockcypher.com/v1/btc/test3");
            latest_blocknumber = latest_blocknumber.data.height;
            const newWallet = await new Wallet({ userId: userId, address: btcAddress, privateKey: btcPrivateKey, currencyId: currency._id, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        } catch (error) {
            console.log("Bitcoin Connection Error!", error);
        }
    }
    else if (user && currency && currency.symbol == 'BCH') {
        // Creating BCH Wallet
        try {
            let createBCHPrivateKey = new bitcoreCash.PrivateKey('testnet');
            let bchPrivateKey = createBCHPrivateKey.toWIF();
            let bchAddress = new bitcoreCash.PrivateKey(bchPrivateKey).toAddress();
            let latest_blocknumber = await axios("https://api.blockchain.info/haskoin-store/bch-testnet/block/best?notx=true");
            latest_blocknumber = latest_blocknumber.data.height;
            const newWallet = await new Wallet({ userId: userId, address: bchAddress, privateKey: bchPrivateKey, currencyId: currency._id, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        } catch (error) {
            console.log("Bitcoin Cash Connection Error!", error);
        }
    }
    else if (user && currency && currency.symbol == 'LTC') {
        // Creating LTC Wallet
        try {
            let createLTCPrivateKey = new litecore.PrivateKey('testnet');
            let ltcPrivateKey = createLTCPrivateKey.toWIF();
            let ltcAddress = new litecore.PrivateKey(ltcPrivateKey).toAddress();
            let latest_blocknumber = await axios("https://chain.so/api/v2/get_info/LTCTEST");
            latest_blocknumber = latest_blocknumber.data.data.blocks;
            const newWallet = await new Wallet({ userId: userId, address: ltcAddress, privateKey: ltcPrivateKey, currencyId: currency._id, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        } catch (error) {
            console.log("Litecoin Connection Error!", error);
        }
    }
    else if (user && currency && currency.symbol == 'DOGE') {
        // Creating LTC Wallet
        try {
            let createLTCPrivateKey = new doge.PrivateKey('testnet');
            let ltcPrivateKey = createLTCPrivateKey.toWIF();
            let ltcAddress = new doge.PrivateKey(ltcPrivateKey).toAddress();
            let latest_blocknumber = await axios("https://chain.so/api/v2/get_info/DOGETEST");
            latest_blocknumber = latest_blocknumber.data.data.blocks;
            const newWallet = await new Wallet({ userId: userId, address: ltcAddress, privateKey: ltcPrivateKey, currencyId: currency._id, isEVM: isEVM, name: user.firstName + "'s " + network.symbol + " Wallet" });
            const newWalletSave = await newWallet.save();
            const blockchainBalance = await new BlockchainBalance({ userId: userId, currencyId: currencyId, networkId: networkId, walletId: newWalletSave._id, onChainBalance: 0, blockNumber: latest_blocknumber });
            blockchainBalance.save();
            return res.status(200).json({ success: true, message: "Wallet created successfully", wallet: { address: newWalletSave.address } });
        } catch (error) {
            console.log("Litecoin Connection Error!", error);
        }
    }
    if (!user)
        return res.status(401).json({ message: 'User not found' });
    if (!network)
        return res.status(401).json({ message: 'Network not found' });
    return res.status(401).json({ message: 'There was a problem creating the wallet' });
}

const transferAllETHToAdminWallet = async () => {
    try {
        const networks = await Network.findOne({ symbol: 'ETH' });
        const query = {
            "$and": [
                {
                    "networkId": { $in: networks }
                }
            ]
        }
        const wallets = await Wallet.find(query)
        let provider = new ethers.providers.EtherscanProvider('rinkeby');
        const adminWallet = await Wallet.findOne({ userId: ObjectId('624c04c17b1291e3b1f9b2fc'), networkId: networks._id })
        const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
        const currency = await Currency.findOne({ symbol: 'ETH' })
        if (wallets && wallets.length > 0 && provider) {
            wallets.filter(row => row.address != adminWallet.address).forEach(async wallet => {
                // get addr balance.
                let gasPrice = await web3.eth.getGasPrice();
                let balance = await web3.utils.fromWei((await web3.eth.getBalance(wallet.address)).toString())

                if (balance > 0 && balance > (parseFloat('21000') * 0.000000001)) {
                    const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest');
                    let coin = await web3.utils.toWei((parseFloat(balance)).toFixed(5).toString(), "ether")
                    let estimate = await web3.eth.estimateGas({
                        "from": wallet.address,
                        "nonce": nonce,
                        "to": adminWallet.address,
                        'value': coin.toString(),
                        // 'gas': '21000'
                    });
                    var transaction = {
                        nonce: nonce,
                        gasPrice: gasPrice,
                        gasLimit: '0xc340',
                        to: adminWallet.address,
                        value: coin.toString(),
                        gas: '21000'
                    }
                    const signedTx = await web3.eth.accounts.signTransaction(transaction, wallet.privateKey);
                    await web3.eth.sendSignedTransaction(signedTx.rawTransaction, async function (error, hash) {
                        if (!error) {
                            // update data in External transations table.
                            let insertExternalTransaction = new ExternalTransaction({
                                userId: adminWallet.userId,
                                fromAddress: wallet.address,
                                toAddress: transaction.to,
                                walletAddress: wallet.address,
                                txHash: hash,
                                amount: transaction.value.toString() ? transaction.value.toString() : '0',
                                gasPrice: transaction.gas,
                                currency: currency.symbol,
                                isResolved: 1,
                                transactionType: 1 //outbound
                            })
                            const saveExternalTransaction = await insertExternalTransaction.save();
                            const account = await Account.findOne({ userId: adminWallet.userId })
                            account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) + parseFloat(transaction.value);
                            account.save();
                        }
                    });
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}


const transferAllXRPToAdminWallet = async () => {
    try {
        let live = process.env.NETWORK_LIVE;
        const networks = await Network.findOne({ symbol: 'XRP' });
        const query = {
            "$and": [
                {
                    "networkId": { $in: networks }
                }
            ]
        }
        const wallets = await Wallet.find(query)
        const adminWallet = await Wallet.findOne({ userId: ObjectId('624c04c17b1291e3b1f9b2fc'), networkId: networks._id })
        const currency = await Currency.findOne({ symbol: 'XRP' })
        let api = new RippleAPI({
            server: live == 1 ? 'wss://s1.ripple.com' : 'wss://s.altnet.rippletest.net:51233'
        })
        await api.connect();
        if (wallets && wallets.length > 0) {
            wallets.filter(row => row.address != adminWallet.address).forEach(async (wallet, index) => {
                let balance = 0;
                await api.getAccountInfo(wallet.address).then(info => {
                    balance = info.xrpBalance - 1;
                });
                if (balance > 0) {
                    // Ripple payments are represented as JavaScript objects
                    const payment = {
                        source: {
                            address: wallet.address,
                            maxAmount: {
                                value: balance.toString(),
                                currency: 'XRP'
                            }
                        },
                        destination: {
                            address: adminWallet.address,
                            amount: {
                                value: balance.toString(),
                                currency: 'XRP'
                            }
                        }
                    };
                    try {
                        // Get ready to submit the payment
                        const prepared = await api.preparePayment(wallet.address, payment, {
                            maxLedgerVersionOffset: 5
                        });
                        // Sign the payment using the sender's secret
                        const { signedTransaction } = api.sign(prepared.txJSON, wallet.privateKey);
                        // Submit the payment
                        const resp = await api.submit(signedTransaction);
                        api.disconnect();
                        // add data to External transations table.
                        let insertExternalTransaction = new ExternalTransaction({
                            userId: adminWallet.userId,
                            fromAddress: wallet.address,
                            toAddress: adminWallet.address,
                            walletAddress: wallet.address,
                            txHash: resp.tx_json.hash,
                            amount: balance.toString() ? balance.toString() : '0',
                            gasPrice: (parseFloat(resp.tx_json.Fee) * 0.000001).toString(),
                            currency: currency.symbol,
                            isResolved: 1,
                            transactionType: 1 //outbound
                        })
                        const saveExternalTransaction = await insertExternalTransaction.save();
                        // subtract amount from user's account
                        const account = await Account.findOne({ userId: adminWallet.userId })
                        account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) + parseFloat(balance);
                        account.save();
                        console.log("done");
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

function financialMfil(numMfil) {
    return Number.parseFloat(numMfil / 1e3).toFixed(3);
}

const transferAllUSDTToAdminWallet = async () => {
    try {
        let live = process.env.NETWORK_LIVE;
        const networks = await Network.findOne({ symbol: 'ETH' });
        const query = {
            "$and": [
                {
                    "networkId": { $in: networks }
                }
            ]
        }
        const wallets = await Wallet.find(query)
        // let provider = new ethers.providers.EtherscanProvider('rinkeby');
        const adminWallet = await Wallet.findOne({ userId: ObjectId('624c04c17b1291e3b1f9b2fc'), networkId: networks._id })
        const currency = await Currency.findOne({ symbol: 'USDT' })

        const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

        let contractAddress = live == 1 ? "0xdac17f958d2ee523a2206206994597c13d831ec7" : "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad";
        let contract = await new web3.eth.Contract(tokenAbi, contractAddress)

        if (wallets && wallets.length > 0) {
            wallets.filter(row => row.address != adminWallet.address).forEach(async (wallet, index) => {
                var count = await web3.eth.getTransactionCount(wallet.address);
                var balance = await contract.methods.balanceOf(wallet.address).call();
                balance = financialMfil(balance)
                if (balance > 0) {

                    // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
                    // Use Gwei for the unit of gas price
                    var gasPriceGwei = 3;
                    var gasLimit = 3000000;
                    // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net
                    var chainId = live ? 1 : 3;
                    let gass = web3.utils.toHex(gasPriceGwei * 1e9);
                    var rawTransaction = {
                        "from": wallet.address,
                        "nonce": "0x" + count.toString(16),
                        "gasPrice": gass,
                        "gasLimit": web3.utils.toHex(gasLimit),
                        "to": contractAddress,
                        "value": "0x0",
                        "data": contract.methods.transfer(adminWallet.address, (parseFloat(balance) - parseFloat(gass))).encodeABI(),
                        "chainId": chainId
                    };

                    // The private key for myAddress in .env
                    var privKey = wallet.privateKey;
                    var tx = new Tx(rawTransaction);
                    tx.sign(privKey);
                    var serializedTx = tx.serialize();

                    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async function (error, hash) {
                        if (!error) {
                            // update data in External transations table.
                            let insertExternalTransaction = new ExternalTransaction({
                                userId: adminWallet.userId,
                                fromAddress: wallet.address,
                                toAddress: adminWallet.address,
                                walletAddress: wallet.address,
                                txHash: hash,
                                amount: balance.toString() ? balance.toString() : '0',
                                gasPrice: gass,
                                currency: currency.symbol,
                                isResolved: 1,
                                transactionType: 1 //outbound
                            })
                            const saveExternalTransaction = await insertExternalTransaction.save();
                            // subtract amount from user's account
                            const account = await Account.findOne({ userId: adminWallet.userId })
                            account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount = parseFloat(account.amounts.find(row => row.currencyId.toString() == currency._id.toString()).amount) + parseFloat(transaction.value);
                            account.save();
                        }
                    });
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.transferAllToAdminWallet = async (req, res) => {
    await transferAllETHToAdminWallet()
    console.log("eth done");
    await transferAllUSDTToAdminWallet()
    console.log("usdt done");
    await transferAllXRPToAdminWallet()
    console.log("xrp done");
}