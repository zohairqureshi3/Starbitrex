const express = require('express')
const router = express.Router()

const auth = require('./auth');
const user = require('./user');
const role = require('./role');
const permission = require('./permission');
const permissionsModule = require('./permissionsModule');
const wallet = require('./wallet');
const account = require('./account');
const currency = require('./currency');
const fiatCurrency = require('./fiatCurrency');
const transaction = require('./transaction');
const externalTransaction = require('./externalTransaction');
const withdrawFee = require('./withdrawFee');
const transactionManagement = require('./transactionManagement');
const setting = require('./setting');
const network = require('./network');
const cronjob = require('./cronjob');
const externalWallet = require('./externalWallet');
const dashboard = require('./dashboard');
const internalOrderHistory = require('./internalOrderHistory');
const leverage = require('./leverage');
const leverageOrder = require('./leverageOrder');
const spotOrder = require('./spotOrder');
const blockchainBalance = require('./blockchainBalance');
const country = require('./country');
const adminComment = require('./adminComment');
const creditCard = require('./creditCard');
const externalFiatTransaction = require('./externalFiatTransaction');
const bankAccount = require('./bankAccount');
const externalBankTransaction = require('./externalBankTransaction');
const salesStatus = require('./salesStatus');
const adminBankAccount = require('./adminBankAccount');
const adminAddress = require('./adminAddress');
const notification = require('./notification');


// const authenticate = require('../middlewares/authenticate');


router.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to the SERVER APIs" });
});


router.use('/auth', auth);
router.use('/user', user);
router.use('/role', role);
router.use('/permission', permission);
router.use('/permissionsModule', permissionsModule);
router.use('/wallet', wallet);
router.use('/external-wallet', externalWallet);
router.use('/account', account);
router.use('/currency', currency);
router.use('/fiat-currency', fiatCurrency);
router.use('/transaction', transaction);
router.use('/externalTransaction', externalTransaction);
router.use('/transactionManagement', transactionManagement);
router.use('/withdrawManagement', withdrawFee);
router.use('/setting', setting);
router.use('/network', network);
router.use('/dashboard', dashboard);
router.use('/internalOrderHistory', internalOrderHistory);
router.use('/leverageOrder', leverageOrder);
router.use('/leverage', leverage);
router.use('/spotOrder', spotOrder);
router.use('/cronjob', cronjob);
router.use('/blockchainBalance', blockchainBalance);
router.use('/country', country);
router.use('/admin-comment', adminComment);
router.use('/credit-card', creditCard);
router.use('/externalFiatTransaction', externalFiatTransaction);
router.use('/bank-account', bankAccount);
router.use('/externalBankTransaction', externalBankTransaction);
router.use('/sales-status', salesStatus);
router.use('/admin-bank-account', adminBankAccount);
router.use('/admin-address', adminAddress);
router.use('/notification', notification);

module.exports = router