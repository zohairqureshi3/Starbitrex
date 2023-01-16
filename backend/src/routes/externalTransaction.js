const express = require('express');
const ExternalTransaction = require('../controllers/externalTransaction');

const router = express.Router();

// Get Pending Transactions
router.get('/pending-transactions', ExternalTransaction.getPendingTransactions)

// POST EXTERNAL TRANACTION 
router.post('/withdraw-coins', ExternalTransaction.withdrawToExternalWallet)

//INDEX
router.get('/', ExternalTransaction.index);

//STORE
router.post('/add', ExternalTransaction.store);

//SHOW
router.get('/:id', ExternalTransaction.show);

// GET USER TRANSACTIONS
router.get('/user-transactions/:id', ExternalTransaction.getUserTransactions);
router.get('/user-deposits/:id', ExternalTransaction.getUserDeposits);
router.get('/user-withdraws/:id', ExternalTransaction.getUserWithdraws);

// Withdraw Coins
// router.post('/withdraw-coins', ExternalTransaction.withdraw);

// Complete Pending Transaction
router.put('/complete-pending-transaction/:id', ExternalTransaction.completePendingTransaction)
router.put('/decline-pending-transaction/:id', ExternalTransaction.declinePendingTransaction)

module.exports = router;
