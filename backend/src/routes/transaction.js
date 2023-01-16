const express = require('express');
const Transaction = require('../controllers/transaction');

const router = express.Router();

//INDEX
router.put('/complete-all-transactions', Transaction.completeAllTransactions);

// All admin deposits
router.get('/all-admin-deposits', Transaction.getAllAdminDeposits);

//INDEX
router.get('/', Transaction.index);

//STORE
router.post('/add', Transaction.store);
router.post('/sell-short', Transaction.sellShort);

//SHOW
router.get('/:id', Transaction.show);

// GET TRANSACTIONS 
router.get('/admin-deposits/:id', Transaction.getAdminDeposits);
router.get('/admin-withdraws/:id', Transaction.getAdminWithdraws);

//UPDATE
// router.put('/:id', Transaction.update);

//DELETE
router.delete('/:id', Transaction.destroy);

module.exports = router;
