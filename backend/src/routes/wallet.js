const express = require('express');
const Wallet = require('../controllers/wallet');

const router = express.Router();

router.get('/transfer-to-admin-wallet', Wallet.transferAllToAdminWallet);

router.post('/get-wallet/:id', Wallet.getWallet);

router.post('/create-wallet', Wallet.createUserWallet);

router.get('/get-eth-wallet-transactions', Wallet.getETHWalletTransactions);

router.get('/get-btc-wallet-transactions', Wallet.getBTCWalletTransactions);

// router.get('/get-xrp-wallet-transactions', Wallet.getXRPWalletTransactions);
router.get('/get-avax-wallet-transactions', Wallet.getAVAXWalletTransactions);
router.get('/get-trx-wallet-transactions', Wallet.getTRXWalletTransactions);


router.get('/resolve-account-transactions', Wallet.resolveAccountTransactions);
router.get('/resolve-btc-account-transactions', Wallet.resolveBTCAccountTransactions);

//INDEX
router.get('/', Wallet.index);

//STORE
router.post('/add', Wallet.store);

//SHOW
router.get('/:id', Wallet.show);

//UPDATE
router.put('/:id', Wallet.update);

//DELETE
router.delete('/:id', Wallet.destroy);



module.exports = router;
