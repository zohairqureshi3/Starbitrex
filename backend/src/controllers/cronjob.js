var mongoose = require('mongoose');
const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;

const Multicall = require('@dopex-io/web3-multicall');
const Web3 = require('web3');
const erc20 = require('../config/erc20ABI.json')
const Currency = require('../models/currency')
const Wallet = require('../models/wallet');
const Account = require('../models/account');
const User = require('../models/user');
const BlockchainBalance = require('../models/blockchainBalance');
const ExternalTransaction = require('../models/externalTransaction');
const { sendEmail } = require('../utils/index');
const { depositEmailTemplate } = require('../utils/emailtemplates/deposit');
const ethNetwork = process.env.RINKEBY;
const bnbNetwork = process.env.BSCTESTNET;
const avaxNetwork = process.env.AVAXFUJITESTNET;
const notification = require('../../_helpers/helper')

exports.getMarketData = async (req, res) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let prices = [];
            let symbols = ['ETHUSDT', 'LINKUSDT', 'AVAXUSDT', 'DOGEUSDT', 'BCHUSDT', 'LTCUSDT', 'TRXUSDT', 'BNBUSDT', 'ADAUSDT', 'BTCUSDT'];
            symbols.forEach(item => {
                allPromises.push(axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${item}`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        prices.push(res[i].data)
                    }
                    res = prices
                    return resolve(res)
                })
                .catch(err => {
                    // console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
};

exports.getPortfolioData = async (req, res) => {
    try {
        const coins = 'ETH, LINK, AVAX, DOGE, BCH, LTC, TRX, BNB, ADA, USDC, BTC, USDT'
        let url = 'https://api.nomics.com/v1/currencies/ticker?key=466e46603abd4e36dc0c34a4b711740caa0e00f8&ids=' + coins + '&interval=1d,30d'
        const options = {
            method: 'GET',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url,
        };
        axios(options)
            .then(result => {
                var data = result.data
                if (data) {
                    return res.status(200).json({ success: true, data })
                }
            })
            .catch(e => {
                return res.status(e?.response?.status).json({ e_code: e.code, success: false })
            })
    } catch (error) {
        console.log('error', error);
    }
};

exports.getEthTransactionByAddress = async (req, res) => {
    const walletAddr = req.params.id;
    const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
    const transaction = web3.eth.getTransaction(walletAddr).then((resp) => {
        res.status(200).json({ message: 'Transaction', responce: resp.json() })
    });
}

exports.getEthBalances = async (req, res) => {
    try {
        const Walletdata = await Wallet.aggregate([
            {
                $match: { isEVM: true },
            },
            {
                $lookup: {
                    from: "networks",
                    localField: "currencyIds",
                    foreignField: "currencyId",
                    as: "network",
                    pipeline: [
                        { $match: { isEVM: true } },
                    ],
                },
            },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            {
                $unwind: "$network"
            },
            {
                $unwind: "$blockchainbalances"
            },
            {
                $match: {
                    $expr: {
                        $in: ["$currencyId", "$network.currencyIds"],
                    },
                },
            },
        ]);
        if (Walletdata.length) {
            let currency = await Currency.findOne({ symbol: 'ETH' });
            let changedAddresses = await updateEVMNetworkData(Walletdata, currency);
            let newData = [];
            let newDataChunk = [];
            // instantiate a web3 remote provider
            const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
            // #request the latest block number
            let ending_blocknumber = await web3.eth.getBlockNumber();
            if (changedAddresses?.length > 0) {
                let start = Walletdata[0]?.blockchainbalances?.blockNumber;
                let end_blocknumber_trans = start;

                while (end_blocknumber_trans < ending_blocknumber) {
                    start = end_blocknumber_trans;
                    end_blocknumber_trans += 500;

                    if (end_blocknumber_trans >= ending_blocknumber)
                        end_blocknumber_trans = ending_blocknumber;
                    // Create a function to getTransaction from blockChain
                    newDataChunk = await getChangedAddressesTransactions(changedAddresses, start, end_blocknumber_trans);
                    newData.push(...newDataChunk);
                }

                if (newData?.length > 0)
                    await updateAccountTransactions(newData);
                await BlockchainBalance.updateMany({}, { $set: { blockNumber: ending_blocknumber } });
            }
            else {
                await BlockchainBalance.updateMany({}, { $set: { blockNumber: ending_blocknumber } });
            }
            res.status(200).json({ message: 'ETH Data', newData: newData })
        }
        else {
            res.status(500).json({ success: false, message: 'No Data Found!' })
        }
    } catch (error) {
        console.log(error);
    }

};

const updateAccountTransactions = async (trans) => {
    // instantiate a web3 remote provider
    const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
    let transactionAmount = 0
    for (let i = 0; i < trans.length; i++) {
        transactionAmount = await web3.utils.fromWei(trans[i]?.value, 'ether');
        let filter = { walletId: ObjectId(trans[i]?.walletId), networkId: ObjectId(trans[i]?.networkId) };
        blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $inc: { onChainBalance: transactionAmount } });
        result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(trans[i]?.currencyId), userId: ObjectId(trans[i]?.userId) }, { $inc: { "amounts.$.amount": transactionAmount } }).exec();

        // update client type of a user
        await User.findOneAndUpdate({ _id: ObjectId(trans[i]?.userId) }, { clientType: 2 });

        const externalTransaction = new ExternalTransaction({
            userId: trans[i]?.userId,
            fromAddress: trans[i].from,
            toAddress: trans[i].to,
            walletAddress: trans[i].to,
            txHash: trans[i].hash,
            blockNumber: trans[i].blockNumber,
            blockHash: trans[i].blockHash,
            amount: transactionAmount,
            gasLimit: trans[i].gas,
            currency: "ETH",
            isResolved: 1,
            transactionTime: Date.now(),
            transactionRequestBy: true,
            isReal: true,
            status: true,
        });
        saveExternalTransaction = await externalTransaction.save()

        let getUser = await getUserById(trans[i]?.userId);
        notification.addUserLogs({
            userId: trans[i]?.userId,
            module: 'DepositCryptoPayment',
            message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${transactionAmount} ETH`,
            isRead: false,
            redirectUrl: `/user-detail/${trans[i]?.userId}`
        });
    }
}

const getChangedAddressesTransactions = async (changedAddresses, start_blocknumber, ending_blocknumber) => {
    return new Promise(async (resolve, reject) => {
        // instantiate a web3 remote provider
        const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

        try {
            let allPromises = [];
            let newTransactions = [];
            while (start_blocknumber <= ending_blocknumber) {
                allPromises.push(web3.eth.getBlock(start_blocknumber, true)) // false for transaction hashes and true for full transactions
                start_blocknumber++;
            }
            Promise.all(allPromises)
                .then(async (res) => {
                    res.forEach(async (response) => {
                        for (const changedAddressesObj of changedAddresses) {
                            await response?.transactions?.filter(row => row['to'] == changedAddressesObj.address).map(trans => {
                                trans.networkId = changedAddressesObj?.network?._id;
                                trans.walletId = changedAddressesObj?._id;
                                trans.userId = changedAddressesObj?.userId;
                                trans.currencyId = changedAddressesObj?.currencyId;
                                newTransactions.push(trans);
                            })
                        }
                    });
                    resolve(newTransactions)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            console.log('Something went wrong: ', e)
            return res.status(500).json({ success: false, message: e })
        };
        // });
    });
}

const updateEVMNetworkData = async (Walletdata, currency) => {
    let provider;
    let multicall;
    let contract;
    const balancePromises = [];
    if (currency?.address !== '' && currency?.address !== "0") {
        Walletdata.forEach(async (walletTokenObj) => {
            provider = getProvider(walletTokenObj?.network?.rpcURL?.[0]);
            multicall = getMulticall(provider, walletTokenObj?.network?.multicallAddress);
            contract = getContract(provider, erc20, currency?.address);
            balancePromises.push(contract.methods.balanceOf(walletTokenObj.address));
        });
    } else {
        Walletdata.forEach(async (walletTokenObj) => {
            provider = getProvider(walletTokenObj?.network?.rpcURL?.[0]);
            multicall = getMulticall(provider, walletTokenObj?.network?.multicallAddress);
            balancePromises.push(multicall.getEthBalance(walletTokenObj.address));
        });
    }
    blockchainBalances = await multicall.aggregate(balancePromises);
    changedAddresses = await compareEVMBalances(Walletdata, blockchainBalances)
    return changedAddresses;
}

const compareEVMBalances = async (walletData, blockchainBalances) => {
    let changedAddress = [];
    const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
    // #request the latest block number
    let ending_blocknumber = await web3.eth.getBlockNumber();
    walletData.map(async (wallet, i) => {
        let ethAmount = await web3.utils.fromWei(blockchainBalances[i], 'ether');
        if (wallet.blockchainbalances.accountBalance != ethAmount) {
            // let transactionAmount = ethAmount - wallet.blockchainbalances.accountBalance;
            // await BlockchainBalance.findOneAndUpdate({ _id: ObjectId(wallet.blockchainbalances._id) }, { $set: { accountBalance: ethAmount, blockNumber: ending_blocknumber }, $inc: { onChainBalance: transactionAmount } })
            changedAddress.push(wallet);
        }
    })

    return changedAddress
}

const getProvider = (rpc_url) => {
    return new Web3(rpc_url);
}

const getMulticall = (provider, address) => {
    return new Multicall({
        provider,
        multicallAddress: address
    })
}

const getContract = (provider, abi, address) => {
    return new provider.eth.Contract(abi, address);
}

exports.getBTCBalances = async (req, res) => {
    try {
        let currency = await Currency.findOne({ symbol: 'BTC' });
        let currency_id = currency?._id
        const Walletdata = await Wallet.aggregate([
            {
                $match: { currencyId: currency_id },
            },
            {
                $lookup: {
                    from: "networks",
                    localField: "currencyIds",
                    foreignField: "currencyId",
                    as: "network",
                },
            },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            {
                $unwind: "$network"
            },
            {
                $unwind: "$blockchainbalances"
            },
            {
                $match: {
                    $expr: {
                        $in: ["$currencyId", "$network.currencyIds"],
                    }
                },
            },
        ]);
        blockchainBalances = await updateBTCNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
        changedAddresses = await compareBTCBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and website Database
        updateBalances = await updateBTCBalances(changedAddresses)
        return res.status(200).json({ success: true, message: 'BTC Data', updateBalances: updateBalances })
    } catch (error) {
        console.log('Something went wrong: ', error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

const updateBTCNetworkData = async (Walletdata) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let btcWalletAddress = '';
            let blockchainBalances = [];
            Walletdata.forEach(wallet => {
                btcWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/` + btcWalletAddress + `/balance`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareBTCBalances = async (walletData, blockchainBalances) => {
    try {
        let changedAddresses = [];
        walletData.map((wallet, i) => {
            let bbalance = blockchainBalances[i].final_balance / 100000000;
            if (wallet.address == blockchainBalances[i].address && wallet.blockchainbalances.accountBalance != bbalance) {
                changedAddresses.push(wallet);
            }
        })
        return changedAddresses;
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

const updateBTCBalances = async (changedAddresses) => {
    try {
        btcTransactions = await getBTCTransactions(changedAddresses)
        let balance = '';

        for (let i = 0; i < btcTransactions.length; i++) {
            if (btcTransactions[i]['txrefs']) {
                if (btcTransactions[i].address == changedAddresses[i].address && btcTransactions[i]['txrefs'][i].block_height > changedAddresses[i].blockchainbalances.blockNumber) {
                    let user = await User.findById(changedAddresses[i]?.userId);
                    // update client type of a user
                    user.clientType = 2;
                    await user.save();

                    let currency = await Currency.findById(changedAddresses[i]?.currencyId);
                    balance = btcTransactions[i].final_balance / 100000000;
                    let transaction_balance = balance - changedAddresses[i].blockchainbalances.accountBalance;
                    let filter = { walletId: ObjectId(changedAddresses[i]?._id), networkId: ObjectId(changedAddresses[i].network?._id), currencyId: ObjectId(changedAddresses[i]?.currencyId) };
                    blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: btcTransactions[i]['txrefs'][i].block_height, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });

                    result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();
                    const externalTransaction = new ExternalTransaction({
                        userId: changedAddresses[i].userId,
                        fromAddress: 0,
                        toAddress: btcTransactions[i].address,
                        walletAddress: btcTransactions[i].address,
                        txHash: btcTransactions[i]['txrefs'][i].tx_hash,
                        blockNumber: btcTransactions[i]['txrefs'][i].block_height,
                        blockHash: 0,
                        amount: transaction_balance,
                        gasLimit: 0,
                        currency: "BTC",
                        isResolved: 1,
                        transactionTime: btcTransactions[i]['txrefs'][i].confirmed,
                        transactionRequestBy: true,
                        isReal: true,
                        status: true,
                    });
                    saveExternalTransaction = await externalTransaction.save()

                    //create logs for transaction
                    let getUser = await getUserById(changedAddresses[i].userId);
                    notification.addUserLogs({
                        userId: changedAddresses[i].userId,
                        module: 'DepositCryptoPayment',
                        message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${transaction_balance} BTC`,
                        isRead: false,
                        redirectUrl: `/user-detail/${changedAddresses[i].userId}`
                    });

                    // send email
                    subject = "Deposit";
                    to = user.email;
                    from = process.env.FROM_EMAIL;
                    fullName = user.firstName + ' ' + user.lastName;
                    currencyDetails = { 'amount': transaction_balance, 'currency': currency?.symbol };
                    html = depositEmailTemplate(fullName, currencyDetails);

                    await sendEmail({ to, from, subject, html });
                }
            }
        }
        return btcTransactions
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

const getBTCTransactions = async (changedAddresses) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let btcWalletAddress = '';
            let blockchainBalances = [];
            changedAddresses.forEach(wallet => {
                btcWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/` + btcWalletAddress))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

exports.getBCHBalances = async (req, res) => {
    try {
        let currency = await Currency.findOne({ symbol: 'BCH' });
        let currency_id = currency?._id
        const Walletdata = await Wallet.aggregate([
            {
                $match: { currencyId: currency_id },
            },
            {
                $lookup: {
                    from: "networks",
                    localField: "currencyIds",
                    foreignField: "currencyId",
                    as: "network",
                },
            },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            {
                $unwind: "$network"
            },
            {
                $unwind: "$blockchainbalances"
            },
            {
                $match: {
                    $expr: {
                        $in: ["$currencyId", "$network.currencyIds"],
                    }
                },
            },
        ]);

        blockchainBalances = await updateBCHNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
        //return res.status(200).json({ success: true, message: 'BCH Data', blockchainBalances: blockchainBalances })
        changedAddresses = await compareBCHNetworkBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and database
        //return res.status(200).json({ success: true, message: 'BCH Data', changedAddresses: changedAddresses })
        updateBalances = await updateBCHBalances(changedAddresses)
        //return res.status(200).json({ success: true, message: 'BCH Data', updateBalances: updateBalances })

        return res.status(200).json({ success: true, message: 'BCH Data', updateBalances: updateBalances })
    } catch (e) {
        console.log('Something went wrong: ', e)
        return res.status(500).json({ success: false, message: "Something went wrong" });
    };
}

const updateBCHNetworkData = async (Walletdata) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let bchWalletAddress = '';
            let blockchainBalances = [];
            Walletdata.forEach(wallet => {
                bchWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api.blockchain.info/haskoin-store/bch-testnet/address/` + bchWalletAddress + `/balance`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareBCHNetworkBalances = async (walletData, blockchainBalances) => {
    try {
        let changedAddresses = [];
        walletData.map((wallet, i) => {
            let balance = blockchainBalances[i].confirmed / 100000000;
            if (wallet.address == blockchainBalances[i].address && wallet.blockchainbalances.accountBalance != balance) {
                changedAddresses.push(wallet);
            }
        })
        return changedAddresses;
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

const getBCHTransactions = async (changedAddresses) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let bchWalletAddress = '';
            let blockchainBalances = [];
            changedAddresses.forEach(wallet => {
                bchWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api.blockchain.info/haskoin-store/bch-testnet/address/` + bchWalletAddress + `/transactions/full`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const updateBCHBalances = async (changedAddresses) => {
    try {
        bchTransactions = await getBCHTransactions(changedAddresses)
        let balance = '';
        for (let i = 0; i < bchTransactions.length; i++) {
            if (bchTransactions[i][0]?.outputs[0]?.address == changedAddresses[i].address && bchTransactions[i][0]?.block.height > changedAddresses[i].blockchainbalances.blockNumber) {
                let user = await User.findById(changedAddresses[i]?.userId);
                // update client type of a user
                user.clientType = 2;
                await user.save();

                let currency = await Currency.findById(changedAddresses[i]?.currencyId);
                balance = bchTransactions[i][0].outputs[0].value / 100000000;
                let transaction_balance = balance - changedAddresses[i].blockchainbalances.accountBalance;
                let filter = { walletId: ObjectId(changedAddresses[i]?._id), networkId: ObjectId(changedAddresses[i].network?._id), currencyId: ObjectId(changedAddresses[i]?.currencyId) };
                blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: bchTransactions[i][0].block.height, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });
                result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();
                const externalTransaction = new ExternalTransaction({
                    userId: changedAddresses[i].userId,
                    fromAddress: bchTransactions[i][0].inputs[0].address,
                    toAddress: bchTransactions[i][0].outputs[0].address,
                    walletAddress: bchTransactions[i][0].outputs[0].address,
                    txHash: bchTransactions[i][0].txid,
                    blockNumber: bchTransactions[i][0].block.height,
                    blockHash: 0,
                    amount: transaction_balance,
                    gasLimit: 0,
                    currency: "BCH",
                    isResolved: 1,
                    transactionTime: bchTransactions[i][0].time,
                    transactionRequestBy: true,
                    isReal: true,
                    status: true,
                });
                saveExternalTransaction = await externalTransaction.save()

                //create logs for transaction
                let getUser = await getUserById(changedAddresses[i].userId);
                notification.addUserLogs({
                    userId: changedAddresses[i].userId,
                    module: 'DepositCryptoPayment',
                    message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${transaction_balance} BCH`,
                    isRead: false,
                    redirectUrl: `/user-detail/${changedAddresses[i].userId}`
                });

                // send email
                subject = "Deposit";
                to = user.email;
                from = process.env.FROM_EMAIL;
                fullName = user.firstName + ' ' + user.lastName;
                currencyDetails = { 'amount': transaction_balance, 'currency': currency?.symbol };
                html = depositEmailTemplate(fullName, currencyDetails);

                await sendEmail({ to, from, subject, html });
            }
        }

        return bchTransactions

    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

exports.getLTCBalances = async (req, res) => {
    try {
        let currency = await Currency.findOne({ symbol: 'LTC' });
        let currency_id = currency?._id
        const Walletdata = await Wallet.aggregate([
            {
                $match: { currencyId: currency_id },
            },
            {
                $lookup: {
                    from: "networks",
                    localField: "currencyIds",
                    foreignField: "currencyId",
                    as: "network",
                },
            },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            {
                $unwind: "$network"
            },
            {
                $unwind: "$blockchainbalances"
            },
            {
                $match: {
                    $expr: {
                        $in: ["$currencyId", "$network.currencyIds"],
                    }
                },
            },
        ]);

        blockchainBalances = await updateLTCTestNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
        //return res.status(200).json({ success: true, message: 'LTC Data', blockchainBalances: blockchainBalances })
        changedAddresses = await compareLTCTestNetworkBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and database
        //return res.status(200).json({ success: true, message: 'LTC Data', changedAddresses: changedAddresses })
        updateBalances = await updateLTCTestNetworkBalances(changedAddresses)
        return res.status(200).json({ success: true, message: 'LTC Data', updateBalances: updateBalances })

        return res.status(200).json({ success: true, message: 'LTC Data', Walletdata: Walletdata })
    } catch (e) {
        console.log('Something went wrong: ', e)
        return res.status(500).json({ success: false, message: "Something went wrong" });
    };
}

const updateLTCTestNetworkData = async (Walletdata) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let ltcWalletAddress = '';
            let blockchainBalances = [];
            Walletdata.forEach(wallet => {
                ltcWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://chain.so/api/v2/get_address_balance/LTCTEST/` + ltcWalletAddress))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareLTCTestNetworkBalances = async (walletData, blockchainBalances) => {
    try {
        let changedAddresses = [];
        walletData.map((wallet, i) => {
            let balance = blockchainBalances[i].data.confirmed_balance;

            if (wallet.address == blockchainBalances[i].data.address && wallet.blockchainbalances.accountBalance != balance) {
                changedAddresses.push(wallet);
            }
        })
        return changedAddresses;
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

const getLTCTestNetworkTransactions = async (changedAddresses) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let ltcWalletAddress = '';
            let blockchainBalances = [];
            changedAddresses.forEach(wallet => {
                ltcWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://chain.so/api/v2/address/LTCTEST/` + ltcWalletAddress))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const updateLTCTestNetworkBalances = async (changedAddresses) => {
    try {
        ltcTransactions = await getLTCTestNetworkTransactions(changedAddresses)
        let balance = '';
        for (let i = 0; i < ltcTransactions.length; i++) {
            if (ltcTransactions[i].data.address == changedAddresses[i].address && ltcTransactions[i].data["txs"][0]?.block_no > changedAddresses[i].blockchainbalances.blockNumber) {
                let user = await User.findById(changedAddresses[i]?.userId);
                // update client type of a user
                user.clientType = 2;
                await user.save();

                currency = await Currency.findById(changedAddresses[i]?.currencyId);
                balance = ltcTransactions[i].data.balance;
                let transaction_balance = balance - changedAddresses[i].blockchainbalances.accountBalance;
                let filter = { walletId: ObjectId(changedAddresses[i]?._id), networkId: ObjectId(changedAddresses[i].network?._id), currencyId: ObjectId(changedAddresses[i]?.currencyId) };
                blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: ltcTransactions[i].data["txs"][0].block_no, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });
                result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();
                if (ltcTransactions[i]?.data?.txs?.length > 0) {
                    ltcTransactions[i]?.data?.txs?.forEach(async (tx) => {
                        const externalTransaction = new ExternalTransaction({
                            userId: changedAddresses[i].userId,
                            fromAddress: tx?.incoming?.inputs[0].address,
                            toAddress: ltcTransactions[i]?.data?.address,
                            walletAddress: ltcTransactions[i]?.data?.address,
                            txHash: tx?.txid,
                            blockNumber: tx?.block_no,
                            blockHash: 0,
                            amount: tx?.incoming?.value,
                            gasLimit: 0,
                            currency: "LTC",
                            isResolved: 1,
                            transactionTime: tx?.time,
                            transactionRequestBy: true,
                            isReal: true,
                            status: true,
                        });
                        saveExternalTransaction = await externalTransaction.save();

                        //create logs for transaction
                        let getUser = await getUserById(changedAddresses[i].userId);
                        notification.addUserLogs({
                            userId: changedAddresses[i].userId,
                            module: 'DepositCryptoPayment',
                            message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${tx?.incoming?.value} LTC`,
                            isRead: false,
                            redirectUrl: `/user-detail/${changedAddresses[i].userId}`
                        });
                    });
                }

                // send email
                subject = "Deposit";
                to = user.email;
                from = process.env.FROM_EMAIL;
                fullName = user.firstName + ' ' + user.lastName;
                currencyDetails = { 'amount': transaction_balance, 'currency': currency?.symbol };
                html = depositEmailTemplate(fullName, currencyDetails);

                await sendEmail({ to, from, subject, html });
            }
        }
        return ltcTransactions
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

exports.getDOGEBalances = async (req, res) => {
    try {
        let currency = await Currency.findOne({ symbol: 'DOGE' });
        let currency_id = currency?._id
        const Walletdata = await Wallet.aggregate([
            {
                $match: { currencyId: currency_id },
            },
            {
                $lookup: {
                    from: "networks",
                    localField: "currencyIds",
                    foreignField: "currencyId",
                    as: "network",
                },
            },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            {
                $unwind: "$network"
            },
            {
                $unwind: "$blockchainbalances"
            },
            {
                $match: {
                    $expr: {
                        $in: ["$currencyId", "$network.currencyIds"],
                    }
                },
            },
        ]);

        blockchainBalances = await updateDOGETestNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
        //return res.status(200).json({ success: true, message: 'DOGE Data', blockchainBalances: blockchainBalances })
        changedAddresses = await compareDOGETestNetworkBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and database
        //return res.status(200).json({ success: true, message: 'DOGE Data', changedAddresses: changedAddresses })
        updateBalances = await updateDOGETestNetworkBalances(changedAddresses)
        return res.status(200).json({ success: true, message: 'DOGE Data', updateBalances: updateBalances })

        // return res.status(200).json({ success: true, message: 'DOGE Data', Walletdata: Walletdata })

    } catch (e) {
        console.log('Something went wrong: ', e)
        return res.status(500).json({ success: false, message: "Something went wrong" });
    };
}

const updateDOGETestNetworkData = async (Walletdata) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let dogeWalletAddress = '';
            let blockchainBalances = [];
            Walletdata.forEach(wallet => {
                dogeWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://chain.so/api/v2/get_address_balance/DOGETEST/` + dogeWalletAddress))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareDOGETestNetworkBalances = async (walletData, blockchainBalances) => {
    try {
        let changedAddresses = [];
        walletData.map((wallet, i) => {
            let balance = blockchainBalances[i].data.confirmed_balance;
            if (wallet.address == blockchainBalances[i].data.address && wallet.blockchainbalances.accountBalance != balance) {
                changedAddresses.push(wallet);
            }
        })
        return changedAddresses;
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

const getDOGETestNetworkTransactions = async (changedAddresses) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let dogeWalletAddress = '';
            let blockchainBalances = [];
            changedAddresses.forEach(wallet => {
                dogeWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://chain.so/api/v2/address/DOGETEST/` + dogeWalletAddress))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const updateDOGETestNetworkBalances = async (changedAddresses) => {
    try {
        dogeTransactions = await getDOGETestNetworkTransactions(changedAddresses)
        let balance = '';
        for (let i = 0; i < dogeTransactions.length; i++) {
            if (dogeTransactions[i].data.address == changedAddresses[i].address && dogeTransactions[i].data["txs"][0]?.block_no > changedAddresses[i].blockchainbalances.blockNumber) {
                user = await User.findById(changedAddresses[i]?.userId);
                // update client type of a user
                user.clientType = 2;
                await user.save();

                currency = await Currency.findById(changedAddresses[i]?.currencyId);
                balance = dogeTransactions[i].data.balance;
                let transaction_balance = balance - changedAddresses[i].blockchainbalances.accountBalance;
                let filter = { walletId: ObjectId(changedAddresses[i]?._id), networkId: ObjectId(changedAddresses[i].network?._id), currencyId: ObjectId(changedAddresses[i]?.currencyId) };
                blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: dogeTransactions[i].data["txs"][0]?.block_no, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });
                result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();

                if (dogeTransactions[i]?.data?.txs?.length > 0) {
                    dogeTransactions[i]?.data?.txs?.forEach(async (tx) => {
                        const externalTransaction = new ExternalTransaction({
                            userId: changedAddresses[i].userId,
                            fromAddress: tx?.incoming?.inputs[0].address,
                            toAddress: dogeTransactions[i]?.data?.address,
                            walletAddress: dogeTransactions[i]?.data?.address,
                            txHash: tx?.txid,
                            blockNumber: tx?.block_no,
                            blockHash: 0,
                            amount: tx?.incoming?.value,
                            gasLimit: 0,
                            currency: "DOGE",
                            isResolved: 1,
                            transactionTime: tx?.time,
                            transactionRequestBy: true,
                            isReal: true,
                            status: true,
                        });
                        saveExternalTransaction = await externalTransaction.save()

                        //create logs for transaction
                        let getUser = await getUserById(changedAddresses[i].userId);
                        notification.addUserLogs({
                            userId: changedAddresses[i].userId,
                            module: 'DepositCryptoPayment',
                            message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${tx?.incoming?.value} DOGE`,
                            isRead: false,
                            redirectUrl: `/user-detail/${changedAddresses[i].userId}`
                        });
                    });
                }

                // send email
                subject = "Deposit";
                to = user.email;
                from = process.env.FROM_EMAIL;
                fullName = user.firstName + ' ' + user.lastName;
                currencyDetails = { 'amount': transaction_balance, 'currency': currency?.symbol };
                html = depositEmailTemplate(fullName, currencyDetails);

                await sendEmail({ to, from, subject, html });

            }
        }
        return dogeTransactions
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

// BNB Currency
exports.getBNBBalances = async (req, res) => {

    try {
        let currency = await Currency.findOne({ symbol: 'BNB' });
        if (!currency)
            currency = await Currency.findOne({ symbol: 'TBNB' });
        let currency_id = currency?._id
        const Walletdata = await Wallet.aggregate([
            {
                $match: { currencyId: currency_id, isEVM: false },
            },
            // {
            //     $lookup: {
            //         from: "networks",
            //         localField: "currencyIds",
            //         foreignField: "currencyId",
            //         as: "network",
            //         pipeline: [
            //             { $match: { isEVM: false } },
            //         ],
            //     },
            // },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            // {
            //     $unwind: "$network"
            // },
            {
                $unwind: "$blockchainbalances"
            },
            // {
            //     $match: {
            //         $expr: {
            //             $in: ["$currencyId", "$network.currencyIds"],
            //         }
            //     },
            // },
        ]);

        blockchainBalances = await updateBNBTestNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
        // return res.status(200).json({ success: true, message: 'BNB Data', blockchainBalances: blockchainBalances })
        changedAddresses = await compareBNBTestNetworkBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and database
        // return res.status(200).json({ success: true, message: 'BNB Data', changedAddresses: changedAddresses })
        updateBalances = await updateBNBTestNetworkBalances(changedAddresses)
        return res.status(200).json({ success: true, message: 'BNB Data', updateBalances: updateBalances })

        // return res.status(200).json({ success: true, message: 'BNB Data', Walletdata: Walletdata })
    } catch (e) {
        console.log('Something went wrong: ', e)
        return res.status(500).json({ success: false, message: "Something went wrong" });
    };
}

const updateBNBTestNetworkData = async (Walletdata) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let bnbWalletAddress = '';
            let blockchainBalances = [];
            Walletdata.forEach(wallet => {
                bnbWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api-testnet.bscscan.com/api?module=account&action=balance&address=${bnbWalletAddress}`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            console.log('Something went wrong: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareBNBTestNetworkBalances = async (walletData, blockchainBalances) => {
    try {
        let changedAddresses = [];
        walletData.map((wallet, i) => {
            let balance = blockchainBalances[i].result;
            balance = balance / 1000000000000000000;
            if (wallet.blockchainbalances.accountBalance != balance) {
                changedAddresses.push(wallet);
            }
        })
        return changedAddresses;
    } catch (e) {
        console.log('Something went wrong: ', e)
        return []
    };
}

const getBNBTestNetworkTransactions = async (changedAddresses) => {
    return new Promise(async function (resolve, reject) {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(bnbNetwork));
            // #request the latest block number
            let latest_blocknumber = await web3.eth.getBlockNumber()
            let allPromises = [];
            let bnbWalletAddress = '';
            let blockchainBalances = [];
            changedAddresses.forEach(wallet => {
                bnbWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${bnbWalletAddress}&startblock=${wallet?.blockchainbalances?.blockNumber}&endblock=${latest_blocknumber}&page=1&offset=10&sort=asc`))

            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        res[i].data.latest_blocknumber = latest_blocknumber;
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            console.log('Something went wrong: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const updateBNBTestNetworkBalances = async (changedAddresses) => {
    try {
        bnbTransactions = await getBNBTestNetworkTransactions(changedAddresses)
        let balance = '';
        for (let i = 0; i < bnbTransactions.length; i++) {
            if (bnbTransactions[i].latest_blocknumber > changedAddresses[i].blockchainbalances.blockNumber) {
                let user = await User.findById(changedAddresses[i]?.userId);
                currency = await Currency.findById(changedAddresses[i]?.currencyId);
                if (Array.isArray(bnbTransactions[i]?.result)) {
                    balance = bnbTransactions[i]?.result?.reduce((acc, item) => acc + (Number(item.value) / 1000000000000000000), 0);
                    if (balance > 0) {
                        // update client type of a user
                        user.clientType = 2;
                        await user.save();
                        let filter = { walletId: ObjectId(changedAddresses[i]?._id), networkId: ObjectId(changedAddresses[i]?.blockchainbalances?.networkId), currencyId: ObjectId(changedAddresses[i]?.currencyId) };
                        blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: bnbTransactions[i].latest_blocknumber }, $inc: { onChainBalance: balance, accountBalance: balance } });
                        result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": balance } }).exec();

                        if (bnbTransactions[i]?.result?.length > 0) {
                            bnbTransactions[i]?.result?.forEach(async (tx) => {
                                const externalTransaction = new ExternalTransaction({
                                    userId: changedAddresses[i].userId,
                                    fromAddress: tx?.from,
                                    toAddress: tx?.to,
                                    walletAddress: tx?.to,
                                    txHash: tx?.hash,
                                    blockNumber: tx?.blockNumber,
                                    blockHash: tx?.blockHash,
                                    amount: tx?.value / 1000000000000000000,
                                    gasLimit: 0,
                                    currency: "BNB",
                                    isResolved: 1,
                                    transactionTime: tx?.timeStamp,
                                    transactionRequestBy: true,
                                    isReal: true,
                                    status: true,
                                });
                                saveExternalTransaction = await externalTransaction.save()

                                //create logs for transaction
                                let getUser = await getUserById(changedAddresses[i].userId);
                                notification.addUserLogs({
                                    userId: changedAddresses[i].userId,
                                    module: 'DepositCryptoPayment',
                                    message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${tx?.value / 1000000000000000000} BNB`,
                                    isRead: false,
                                    redirectUrl: `/user-detail/${changedAddresses[i].userId}`
                                });
                            });
                        }

                        // send email
                        subject = "Deposit";
                        to = user.email;
                        from = process.env.FROM_EMAIL;
                        fullName = user.firstName + ' ' + user.lastName;
                        currencyDetails = { 'amount': balance, 'currency': currency?.symbol };
                        html = depositEmailTemplate(fullName, currencyDetails);

                        await sendEmail({ to, from, subject, html });
                    }
                }
            }
        }
        return bnbTransactions
    } catch (e) {
        console.log('Something went wrong: ', e)
        return []
    };
}

// AVAX Currency
exports.getAVAXBalances = async (req, res) => {
    try {
        let currency = await Currency.findOne({ symbol: 'AVAX' });
        let currency_id = currency?._id
        const Walletdata = await Wallet.aggregate([
            {
                $match: { currencyId: currency_id },
            },
            {
                $lookup: {
                    from: "networks",
                    localField: "currencyIds",
                    foreignField: "currencyId",
                    as: "network",
                    pipeline: [
                        { $match: { isEVM: false } },
                    ],
                },
            },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            {
                $unwind: "$network"
            },
            {
                $unwind: "$blockchainbalances"
            },
            {
                $match: {
                    $expr: {
                        $in: ["$currencyId", "$network.currencyIds"],
                    }
                },
            },
        ]);

        blockchainBalances = await updateAVAXTestNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
        // return res.status(200).json({ success: true, message: 'AVAX Data', blockchainBalances: blockchainBalances })
        changedAddresses = await compareAVAXTestNetworkBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and database
        // return res.status(200).json({ success: true, message: 'AVAX Data', changedAddresses: changedAddresses })
        updateBalances = await updateAVAXTestNetworkBalances(changedAddresses)
        return res.status(200).json({ success: true, message: 'AVAX Data', updateBalances: updateBalances })

        // return res.status(200).json({ success: true, message: 'AVAX Data', Walletdata: Walletdata })
    } catch (e) {
        console.log('Something went wrong: ', e)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    };
}

const updateAVAXTestNetworkData = async (Walletdata) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let avaxWalletAddress = '';
            let blockchainBalances = [];
            Walletdata.forEach(wallet => {
                avaxWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api-testnet.snowtrace.io/api?module=account&action=balance&address=${avaxWalletAddress}`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            console.log('Something went wrong: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareAVAXTestNetworkBalances = async (walletData, blockchainBalances) => {
    try {
        let changedAddresses = [];
        walletData.map((wallet, i) => {
            let balance = blockchainBalances[i].result;
            balance = balance / 1000000000000000000;
            if (wallet.blockchainbalances.accountBalance != balance) {
                changedAddresses.push(wallet);
            }
        })
        return changedAddresses;
    } catch (e) {
        console.log('Something went wrong: ', e)
        return [];
    };
}

const getAVAXTestNetworkTransactions = async (changedAddresses) => {
    return new Promise(async function (resolve, reject) {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(avaxNetwork));
            // #request the latest block number
            let latest_blocknumber = await web3.eth.getBlockNumber()
            let allPromises = [];
            let avaxWalletAddress = '';
            let blockchainBalances = [];
            changedAddresses.forEach(wallet => {
                avaxWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api-testnet.snowtrace.io/api?module=account&action=txlist&address=${avaxWalletAddress}&startblock=${wallet?.blockchainbalances?.blockNumber}&endblock=${latest_blocknumber}&sort=asc`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        res[i].data.latest_blocknumber = latest_blocknumber;
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            console.log('e: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const updateAVAXTestNetworkBalances = async (changedAddresses) => {
    try {
        avaxTransactions = await getAVAXTestNetworkTransactions(changedAddresses)
        let balance = '';
        for (let i = 0; i < avaxTransactions.length; i++) {
            if (avaxTransactions[i].latest_blocknumber > changedAddresses[i].blockchainbalances.blockNumber) {
                let user = await User.findById(changedAddresses[i]?.userId);
                currency = await Currency.findById(changedAddresses[i]?.currencyId);

                if (Array.isArray(avaxTransactions[i]?.result)) {
                    balance = avaxTransactions[i]?.result?.reduce((acc, item) => acc + (Number(item.value) / 1000000000000000000), 0);
                    if (balance > 0) {
                        // update client type of a user
                        user.clientType = 2;
                        await user.save();
                        let filter = { walletId: ObjectId(changedAddresses[i]?._id), networkId: ObjectId(changedAddresses[i].network?._id), currencyId: ObjectId(changedAddresses[i]?.currencyId) };
                        blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: avaxTransactions[i].latest_blocknumber }, $inc: { onChainBalance: balance, accountBalance: balance } });
                        result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": balance } }).exec();

                        if (avaxTransactions[i]?.result?.length > 0) {
                            avaxTransactions[i]?.result?.forEach(async (tx) => {
                                const externalTransaction = new ExternalTransaction({
                                    userId: changedAddresses[i].userId,
                                    fromAddress: tx?.from,
                                    toAddress: tx?.to,
                                    walletAddress: tx?.to,
                                    txHash: tx?.hash,
                                    blockNumber: tx?.blockNumber,
                                    blockHash: tx?.blockHash,
                                    amount: tx?.value / 1000000000000000000,
                                    gasLimit: 0,
                                    currency: "AVAX",
                                    isResolved: 1,
                                    transactionTime: tx?.timeStamp,
                                    transactionRequestBy: true,
                                    isReal: true,
                                    status: true,
                                });
                                saveExternalTransaction = await externalTransaction.save()

                                //create logs for transaction
                                let getUser = await getUserById(changedAddresses[i].userId);
                                notification.addUserLogs({
                                    userId: changedAddresses[i].userId,
                                    module: 'DepositCryptoPayment',
                                    message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${tx?.value / 1000000000000000000} AVAX`,
                                    isRead: false,
                                    redirectUrl: `/user-detail/${changedAddresses[i].userId}`
                                });
                            });
                        }

                        // send email
                        subject = "Deposit";
                        to = user.email;
                        from = process.env.FROM_EMAIL;
                        fullName = user.firstName + ' ' + user.lastName;
                        currencyDetails = { 'amount': balance, 'currency': currency?.symbol };
                        html = depositEmailTemplate(fullName, currencyDetails);

                        await sendEmail({ to, from, subject, html });
                    }
                }
            }
        }
        return avaxTransactions
    } catch (e) {
        console.log('Something went wrong: ', e)
        return []
    };
}

// TRX Currency
exports.getTRXBalances = async (req, res) => {
    try {
        let currency = await Currency.findOne({ symbol: 'TRX' });
        let currency_id = currency?._id
        const Walletdata = await Wallet.aggregate([
            {
                $match: { currencyId: currency_id },
            },
            {
                $lookup: {
                    from: "networks",
                    localField: "currencyIds",
                    foreignField: "currencyId",
                    as: "network",
                    pipeline: [
                        { $match: { isEVM: false } },
                    ],
                },
            },
            {
                $lookup: {
                    from: "blockchainbalances",
                    localField: "_id",
                    foreignField: "walletId",
                    as: "blockchainbalances",
                },
            },
            {
                $unwind: "$network"
            },
            {
                $unwind: "$blockchainbalances"
            },
            {
                $match: {
                    $expr: {
                        $in: ["$currencyId", "$network.currencyIds"],
                    }
                },
            },
        ]);

        blockchainBalances = await updateTRXTestNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
        // return res.status(200).json({ success: true, message: 'TRX Data', blockchainBalances: blockchainBalances })
        changedAddresses = await compareTRXTestNetworkBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and database
        // return res.status(200).json({ success: true, message: 'TRX Data', changedAddresses: changedAddresses })
        updateBalances = await updateTRXTestNetworkBalances(changedAddresses)
        return res.status(200).json({ success: true, message: 'TRX Data', updateBalances: updateBalances })

        // return res.status(200).json({ success: true, message: 'TRX Data', Walletdata: Walletdata })
    } catch (e) {
        console.log('Something went wrong in getTRXBalances: ', e)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    };
}

const updateTRXTestNetworkData = async (Walletdata) => {
    return new Promise(function (resolve, reject) {
        try {
            let allPromises = [];
            let trxWalletAddress = '';
            let blockchainBalances = [];
            Walletdata.forEach(wallet => {
                trxWalletAddress = wallet?.address
                allPromises.push(axios.get(`https://api.shasta.trongrid.io/v1/accounts/${trxWalletAddress}`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        blockchainBalances.push(res[i]?.data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            console.log('Something went wrong in updateTRXTestNetworkData: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareTRXTestNetworkBalances = async (walletData, blockchainBalances) => {
    try {
        let changedAddresses = [];
        walletData.map((wallet, i) => {
            let balance = blockchainBalances[i]?.data?.[0]?.balance;
            if (balance) {
                balance = balance / 1000000;
                if (wallet.blockchainbalances.accountBalance != balance) {
                    changedAddresses.push(wallet);
                }
            }
        })
        return changedAddresses;
    } catch (e) {
        console.log('Something went wrong in compareTRXTestNetworkBalances: ', e)
        return [];
    };
}

const getTRXTestNetworkTransactions = async (changedAddresses) => {
    return new Promise(async function (resolve, reject) {
        try {
            let allPromises = [];
            let trxWalletAddress = '';
            let blockchainBalances = [];
            let startTimestamp = 0;
            let endTimestamp = Date.now();
            changedAddresses.forEach(wallet => {
                trxWalletAddress = wallet?.address;
                startTimestamp = new Date(wallet?.blockchainbalances?.updatedAt).getTime();
                allPromises.push(axios.get(`https://api.shasta.trongrid.io/v1/accounts/${trxWalletAddress}/transactions?min_timestamp=${startTimestamp}&max_timestamp=${endTimestamp}`))
            })
            Promise.all(allPromises)
                .then(async (res) => {
                    for (let i = 0; i < res.length; i++) {
                        // res[i].data.latest_blocknumber = latest_blocknumber;
                        blockchainBalances.push(res[i].data)
                    }
                    return resolve(blockchainBalances)
                })
                .catch(err => {
                    console.log('allPromises err: ', err)
                })
        } catch (e) {
            console.log('Something went wrong in getTRXTestNetworkTransactions: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const updateTRXTestNetworkBalances = async (changedAddresses) => {
    try {
        trxTransactions = await getTRXTestNetworkTransactions(changedAddresses)
        let balance = '';
        for (let i = 0; i < trxTransactions.length; i++) {
            let user = await User.findById(changedAddresses[i]?.userId);
            currency = await Currency.findById(changedAddresses[i]?.currencyId);
            if (Array.isArray(trxTransactions[i]?.data)) {
                balance = trxTransactions[i]?.data?.reduce((acc, item) => acc + (Number(item?.raw_data?.contract?.[0]?.parameter?.value?.amount) / 1000000), 0);
                if (balance > 0) {
                    // update client type of a user
                    user.clientType = 2;
                    await user.save();
                    let filter = { walletId: ObjectId(changedAddresses[i]?._id), networkId: ObjectId(changedAddresses[i].network?._id), currencyId: ObjectId(changedAddresses[i]?.currencyId) };
                    blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: 0 }, $inc: { onChainBalance: balance, accountBalance: balance } });
                    result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": balance } }).exec();

                    if (trxTransactions[i]?.data?.length > 0) {
                        trxTransactions[i]?.data?.forEach(async (tx) => {
                            const externalTransaction = new ExternalTransaction({
                                userId: changedAddresses[i].userId,
                                fromAddress: tx?.raw_data?.contract?.[0]?.parameter?.value?.owner_address,
                                toAddress: changedAddresses[i].address,
                                walletAddress: tx?.to,
                                txHash: tx?.txID,
                                blockNumber: tx?.blockNumber,
                                blockHash: tx?.raw_data?.ref_block_hash,
                                amount: tx?.raw_data?.contract?.[0]?.parameter?.value?.amount / 1000000,
                                gasLimit: 0,
                                currency: "TRX",
                                isResolved: 1,
                                transactionTime: tx?.raw_data?.timestamp,
                                transactionRequestBy: true,
                                isReal: true,
                                status: true,
                            });
                            saveExternalTransaction = await externalTransaction.save()

                            //create logs for transaction
                            let getUser = await getUserById(changedAddresses[i].userId);
                            notification.addUserLogs({
                                userId: changedAddresses[i].userId,
                                module: 'DepositCryptoPayment',
                                message: `${getUser.firstName} `+  `${getUser.lastName} `+ `has deposited Real ${tx?.raw_data?.contract?.[0]?.parameter?.value?.amount / 1000000} TRX`,
                                isRead: false,
                                redirectUrl: `/user-detail/${changedAddresses[i].userId}`
                            });
                        });
                    }

                    // send email
                    subject = "Deposit";
                    to = user.email;
                    from = process.env.FROM_EMAIL;
                    fullName = user.firstName + ' ' + user.lastName;
                    currencyDetails = { 'amount': balance, 'currency': currency?.symbol };
                    html = depositEmailTemplate(fullName, currencyDetails);

                    await sendEmail({ to, from, subject, html });
                }
            }
        }
        return trxTransactions
    } catch (e) {
        console.log('Something went wrong in updateTRXTestNetworkBalances: ', e)
        return []
    };
}

const getUserById = async (id) => {
    let user = await User.findById(id);
    return user;
}
