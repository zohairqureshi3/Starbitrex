const express = require('express');
const ExternalFiatTransaction = require('../controllers/externalFiatTransaction');

const router = express.Router();

// Get Pending Transactions
router.get('/pending-fiat-transactions', ExternalFiatTransaction.getPendingFiatTransactions)

// POST EXTERNAL TRANACTION 
router.post('/withdraw-fiat-coins', ExternalFiatTransaction.withdrawToExternalFiatCard)
// RESOLVE TRANSACTION
router.post('/resolve-withdraw-fiat-transaction/:id', ExternalFiatTransaction.resolveWithDrawFiatTransaction);

//INDEX
router.get('/', ExternalFiatTransaction.index);

//STORE
router.post('/add', ExternalFiatTransaction.store);

//SHOW
router.get('/:id', ExternalFiatTransaction.show);

// GET USER TRANSACTIONS
router.get('/user-fiat-transactions/:id', ExternalFiatTransaction.getUserFiatTransactions);
// router.get('/user-deposits/:id', ExternalFiatTransaction.getUserFiatDeposits);
router.get('/user-fiat-withdraws/:id', ExternalFiatTransaction.getUserFiatWithdraws);

// Withdraw Coins
// router.post('/withdraw-coins', ExternalTransaction.withdraw);

// Complete Pending Transaction
// router.put('/complete-pending-fiat-transaction/:id', ExternalFiatTransaction.completePendingFiatTransaction)

module.exports = router;