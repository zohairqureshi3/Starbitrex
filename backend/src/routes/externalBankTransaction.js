const express = require('express');
const ExternalBankTransaction = require('../controllers/externalBankTransaction');

const router = express.Router();

// Get Pending Transactions
router.get('/pending-bank-transactions', ExternalBankTransaction.getPendingBankTransactions)

// POST EXTERNAL TRANACTION
router.post('/withdraw-bank-coins', ExternalBankTransaction.withdrawToExternalBank)

// RESOLVE TRANSACTION
router.post('/resolve-withdraw-bank-transaction/:id', ExternalBankTransaction.resolveWithDrawBankTransaction);

//INDEX
router.get('/', ExternalBankTransaction.index);

//STORE
router.post('/add', ExternalBankTransaction.store);

//SHOW
router.get('/:id', ExternalBankTransaction.show);

// GET USER TRANSACTIONS
router.get('/user-bank-transactions/:id', ExternalBankTransaction.getUserBankTransactions);
router.get('/user-bank-withdraws/:id', ExternalBankTransaction.getUserBankWithdraws);

module.exports = router;
