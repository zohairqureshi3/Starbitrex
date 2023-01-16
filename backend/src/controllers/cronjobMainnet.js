var mongoose = require('mongoose');
const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;

const Multicall = require('@dopex-io/web3-multicall');
const Web3 = require('web3');
const erc20 = require('../config/erc20ABI.json')
const Currency = require('../models/currency')
const Network = require('../models/network')
const Wallet = require('../models/wallet');
const Account = require('../models/account');
const BlockchainBalance = require('../models/blockchainBalance');
const ExternalTransaction = require('../models/externalTransaction');
const ethNetwork = process.env.RINKEBY;
const bnbNetwork = process.env.BSCTESTNET;
const avaxNetwork = process.env.AVAXFUJITESTNET;

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
                return res.status(e?.response?.status).json({ e_code: e.code, success: false, message: e?.response?.statusText })
            })
    } catch (error) {
        console.log(error);
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
    const Walletdata = await Wallet.aggregate([
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
        if (changedAddresses?.length > 0) {
            // instantiate a web3 remote provider
            const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
            // #request the latest block number
            let ending_blocknumber = await web3.eth.getBlockNumber();
            // Create a function to getTransaction from blockChain
            newData = await getChangedAddressesTransactions(changedAddresses, ending_blocknumber)
            if (newData?.length > 0)
                await updateAccountTransactions(newData, Walletdata);
            await BlockchainBalance.updateMany({}, { $set: { blockNumber: ending_blocknumber } });
        }
        res.status(200).json({ message: 'ETH Data', newData: Walletdata })
    }
    else {
        res.status(500).json({ success: false, message: 'No Data Found!' })
    }
};

const updateAccountTransactions = async (trans, walletData) => {
    // instantiate a web3 remote provider
    const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
    let transactionAmount = 0
    for (let i = 0; i < trans.length; i++) {
        transactionAmount = await web3.utils.fromWei(trans[i]?.value, 'ether');
        let filter = { walletId: ObjectId(trans[i]?.walletId), networkId: ObjectId(trans[i]?.networkId) };
        blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $inc: { onChainBalance: transactionAmount } });
        account = await Account.findOne({ userId: walletData[i].userId })
        result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[i].currencyId), userId: ObjectId(changedAddresses[i].userId) }, { $inc: { "amounts.$.amount": transactionAmount } }).exec();
        const externalTransaction = new ExternalTransaction({
            userId: walletData[i].userId,
            fromAddress: trans[i].from,
            toAddress: trans[i].to,
            txHash: trans[i].hash,
            blockNumber: trans[i].blockNumber,
            blockHash: trans[i].blockHash,
            amount: transactionAmount,
            gasLimit: trans[i].gas,
            currency: "ETH",
            isResolved: 1,
            transactionTime: Date.now(),
            status: true,
        });
        saveExternalTransaction = await externalTransaction.save()
    }
}

const getChangedAddressesTransactions = async (changedAddressesArray, ending_blocknumber) => {
    return new Promise(async (resolve, reject) => {
        // getting all transactions of an address starting from a block number to the latest block...
        // instantiate a web3 remote provider
        const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
        // last block searched for this wallet address. temporarily latest block number minus 100 blocks 
        // let starting_blocknumber = 11177528 - 2  //ending_blocknumber - 5
        // filter through blocks and look for transactions involving this address
        changedAddressesArray.forEach(changedAddressesObj => {
            let start = changedAddressesObj.blockchainbalances.blockNumber;
            ending_blocknumber = changedAddressesObj.blockchainbalances.blockNumber + 10;    // temp for testing
            try {
                let allPromises = [];
                let newTransactions = [];
                while (start <= ending_blocknumber) {
                    allPromises.push(web3.eth.getBlock(start, true)) // false for transaction hashes and true for full transactions
                    start++;
                }
                Promise.all(allPromises)
                    .then(async (res) => {
                        res.forEach(async (response) => {
                            await response?.transactions?.filter(row => row['to'] == changedAddressesObj.address).map(trans => {
                                trans.networkId = changedAddressesObj?.network?._id;
                                trans.walletId = changedAddressesObj?._id;
                                newTransactions.push(trans);
                            })
                        });
                        resolve(newTransactions)
                    })
                    .catch(err => {
                        console.log('allPromises err: ', err)
                    })
            } catch (e) {
                return res.status(500).json({ success: false, message: e })
            };
        });
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
    walletData.map(async (wallet, index) => {
        let ethAmount = await web3.utils.fromWei(blockchainBalances[index], 'ether');
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
    //return res.status(200).json({ success: true, message: 'BTC Data', blockchainBalances: blockchainBalances })
    changedAddresses = await compareBTCBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and website Database
    updateBalances = await updateBTCBalances(changedAddresses)
    return res.status(200).json({ success: true, message: 'BTC Data', updateBalances: updateBalances })
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
    let changedAddresses = [];
    walletData.map((wallet, index) => {
        let bbalance = blockchainBalances[index].final_balance / 100000000;
        if (wallet.address == blockchainBalances[index].address && wallet.blockchainbalances.accountBalance != bbalance) {
            changedAddresses.push(wallet);
        }
    })
    return changedAddresses;
}

const updateBTCBalances = async (changedAddresses) => {
    btcTransactions = await getBTCTransactions(changedAddresses)
    let balance = '';

    for (let index = 0; index < btcTransactions.length; index++) {
        if (btcTransactions[index]['txrefs']) {
            if (btcTransactions[index].address == changedAddresses[index].address && btcTransactions[index]['txrefs'][index].block_height > changedAddresses[index].blockchainbalances.blockNumber) {
                balance = btcTransactions[index].final_balance / 100000000;
                let transaction_balance = balance - changedAddresses[index].blockchainbalances.accountBalance;
                let filter = { walletId: ObjectId(changedAddresses[index]?._id), networkId: ObjectId(changedAddresses[index].network?._id), currencyId: ObjectId(changedAddresses[index]?.currencyId) };
                blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: btcTransactions[index]['txrefs'][index].block_height, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });

                result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[index].currencyId), userId: ObjectId(changedAddresses[index].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();
            }
        }
    }
    return btcTransactions
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

    return res.status(200).json({ success: true, message: 'BCH Data', Walletdata: Walletdata })
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
    let changedAddresses = [];
    walletData.map((wallet, index) => {
        let balance = blockchainBalances[index].confirmed / 100000000;
        if (wallet.address == blockchainBalances[index].address && wallet.blockchainbalances.accountBalance != balance) {
            changedAddresses.push(wallet);
        }
    })
    return changedAddresses;
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
    bchTransactions = await getBCHTransactions(changedAddresses)
    let balance = '';
    for (let index = 0; index < bchTransactions.length; index++) {
        if (bchTransactions[index][0]?.outputs[0]?.address == changedAddresses[index].address && bchTransactions[index][0]?.block.height > changedAddresses[index].blockchainbalances.blockNumber) {
            balance = bchTransactions[index][0].outputs[0].value / 100000000;
            let transaction_balance = balance - changedAddresses[index].blockchainbalances.accountBalance;
            let filter = { walletId: ObjectId(changedAddresses[index]?._id), networkId: ObjectId(changedAddresses[index].network?._id), currencyId: ObjectId(changedAddresses[index]?.currencyId) };
            blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: bchTransactions[index][0].block.height, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });
            result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[index].currencyId), userId: ObjectId(changedAddresses[index].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();
        }
    }

    return bchTransactions
}

exports.getLTCBalances = async (req, res) => {
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
    let changedAddresses = [];
    walletData.map((wallet, index) => {
        let balance = blockchainBalances[index].data.confirmed_balance;

        if (wallet.address == blockchainBalances[index].data.address && wallet.blockchainbalances.accountBalance != balance) {
            changedAddresses.push(wallet);
        }
    })
    return changedAddresses;
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
    ltcTransactions = await getLTCTestNetworkTransactions(changedAddresses)
    let balance = '';
    for (let index = 0; index < ltcTransactions.length; index++) {
        if (ltcTransactions[index].data.address == changedAddresses[index].address && ltcTransactions[index].data["txs"][0]?.block_no > changedAddresses[index].blockchainbalances.blockNumber) {
            balance = ltcTransactions[index].data.balance;
            let transaction_balance = balance - changedAddresses[index].blockchainbalances.accountBalance;
            let filter = { walletId: ObjectId(changedAddresses[index]?._id), networkId: ObjectId(changedAddresses[index].network?._id), currencyId: ObjectId(changedAddresses[index]?.currencyId) };
            blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: ltcTransactions[index].data["txs"][0].block_no, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });
            result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[index].currencyId), userId: ObjectId(changedAddresses[index].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();
        }
    }
    return ltcTransactions
}

exports.getDOGEBalances = async (req, res) => {
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
    let changedAddresses = [];
    walletData.map((wallet, index) => {
        let balance = blockchainBalances[index].data.confirmed_balance;
        if (wallet.address == blockchainBalances[index].data.address && wallet.blockchainbalances.accountBalance != balance) {
            changedAddresses.push(wallet);
        }
    })
    return changedAddresses;
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
    dogeTransactions = await getDOGETestNetworkTransactions(changedAddresses)
    let balance = '';
    for (let index = 0; index < dogeTransactions.length; index++) {
        if (dogeTransactions[index].data.address == changedAddresses[index].address && dogeTransactions[index].data["txs"][0]?.block_no > changedAddresses[index].blockchainbalances.blockNumber) {
            balance = dogeTransactions[index].data.balance;
            let transaction_balance = balance - changedAddresses[index].blockchainbalances.accountBalance;
            let filter = { walletId: ObjectId(changedAddresses[index]?._id), networkId: ObjectId(changedAddresses[index].network?._id), currencyId: ObjectId(changedAddresses[index]?.currencyId) };
            blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: dogeTransactions[index].data["txs"][0]?.block_no, accountBalance: balance }, $inc: { onChainBalance: transaction_balance } });
            result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[index].currencyId), userId: ObjectId(changedAddresses[index].userId) }, { $inc: { "amounts.$.amount": transaction_balance } }).exec();
        }
    }
    return dogeTransactions
}

// BNB Currency
exports.getBNBBalances = async (req, res) => {
    let currency = await Currency.findOne({ symbol: 'BNB' });
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

    blockchainBalances = await updateBNBTestNetworkData(Walletdata); // Get balance from blockchain against all of there addresses
    // return res.status(200).json({ success: true, message: 'BNB Data', blockchainBalances: blockchainBalances })
    changedAddresses = await compareBNBTestNetworkBalances(Walletdata, blockchainBalances) // Compare balance live blockchain and database
    // return res.status(200).json({ success: true, message: 'BNB Data', changedAddresses: changedAddresses })
    updateBalances = await updateBNBTestNetworkBalances(changedAddresses)
    return res.status(200).json({ success: true, message: 'BNB Data', updateBalances: updateBalances })

    // return res.status(200).json({ success: true, message: 'BNB Data', Walletdata: Walletdata })
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
    let changedAddresses = [];
    walletData.map((wallet, index) => {
        let balance = blockchainBalances[index].result;
        balance = balance / 1000000000000000000;
        if (wallet.blockchainbalances.accountBalance != balance) {
            changedAddresses.push(wallet);
        }
    })
    return changedAddresses;
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
    bnbTransactions = await getBNBTestNetworkTransactions(changedAddresses)
    let balance = '';
    for (let index = 0; index < bnbTransactions.length; index++) {
        if (bnbTransactions[index].latest_blocknumber > changedAddresses[index].blockchainbalances.blockNumber) {
            balance = bnbTransactions[index].result.reduce((acc, item) => acc + (Number(item.value) / 1000000000000000000), 0);
            if (balance > 0) {
                let filter = { walletId: ObjectId(changedAddresses[index]?._id), networkId: ObjectId(changedAddresses[index].network?._id), currencyId: ObjectId(changedAddresses[index]?.currencyId) };
                blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: bnbTransactions[index].latest_blocknumber }, $inc: { onChainBalance: balance, accountBalance: balance } });
                result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[index].currencyId), userId: ObjectId(changedAddresses[index].userId) }, { $inc: { "amounts.$.amount": balance } }).exec();
            }
        }
    }
    return bnbTransactions
}

// AVAX Currency
exports.getAVAXBalances = async (req, res) => {
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
    let changedAddresses = [];
    walletData.map((wallet, index) => {
        let balance = blockchainBalances[index].result;
        balance = balance / 1000000000000000000;
        if (wallet.blockchainbalances.accountBalance != balance) {
            changedAddresses.push(wallet);
        }
    })
    return changedAddresses;
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
    avaxTransactions = await getAVAXTestNetworkTransactions(changedAddresses)
    let balance = '';
    for (let index = 0; index < avaxTransactions.length; index++) {
        if (avaxTransactions[index].latest_blocknumber > changedAddresses[index].blockchainbalances.blockNumber) {
            balance = avaxTransactions[index].result.reduce((acc, item) => acc + (Number(item.value) / 1000000000000000000), 0);
            if (balance > 0) {
                let filter = { walletId: ObjectId(changedAddresses[index]?._id), networkId: ObjectId(changedAddresses[index].network?._id), currencyId: ObjectId(changedAddresses[index]?.currencyId) };
                blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: avaxTransactions[index].latest_blocknumber }, $inc: { onChainBalance: balance, accountBalance: balance } });
                result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[index].currencyId), userId: ObjectId(changedAddresses[index].userId) }, { $inc: { "amounts.$.amount": balance } }).exec();
            }
        }
    }
    return avaxTransactions
}

// TRX Currency
exports.getTRXBalances = async (req, res) => {
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
            console.log('Something went wrong: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const compareTRXTestNetworkBalances = async (walletData, blockchainBalances) => {
    let changedAddresses = [];
    walletData.map((wallet, index) => {
        let balance = blockchainBalances[index]?.data?.[0]?.balance;
        if (balance) {
            balance = balance / 1000000;
            if (wallet.blockchainbalances.accountBalance != balance) {
                changedAddresses.push(wallet);
            }
        }
    })
    return changedAddresses;
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
            console.log('e: ', e)
            return res.status(500).json({ success: false, message: "Something went wrong" })
        };
    });
}

const updateTRXTestNetworkBalances = async (changedAddresses) => {
    trxTransactions = await getTRXTestNetworkTransactions(changedAddresses)
    let balance = '';
    for (let index = 0; index < trxTransactions.length; index++) {
        balance = trxTransactions[index]?.data?.reduce((acc, item) => acc + (Number(item?.raw_data?.contract?.[0]?.parameter?.value?.amount) / 1000000), 0);
        if (balance > 0) {
            let filter = { walletId: ObjectId(changedAddresses[index]?._id), networkId: ObjectId(changedAddresses[index].network?._id), currencyId: ObjectId(changedAddresses[index]?.currencyId) };
            blockchainBalance = await BlockchainBalance.findOneAndUpdate(filter, { $set: { blockNumber: 0 }, $inc: { onChainBalance: balance, accountBalance: balance } });
            result = await Account.findOneAndUpdate({ "amounts.currencyId": ObjectId(changedAddresses[index].currencyId), userId: ObjectId(changedAddresses[index].userId) }, { $inc: { "amounts.$.amount": balance } }).exec();
        }
    }
    return trxTransactions
}