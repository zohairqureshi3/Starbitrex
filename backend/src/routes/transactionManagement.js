const express = require('express');
const TransactionManagement = require('../controllers/transactionManagement');

const router = express.Router();

//INDEX
router.get('/', TransactionManagement.index);

//STORE
router.post('/add', TransactionManagement.store);

//SHOW
router.get('/:id', TransactionManagement.show);

//UPDATE
router.put('/:id', TransactionManagement.update);

//DELETE
router.delete('/:id', TransactionManagement.destroy);

// GET FEE W.R.T Coin
router.post('/get-fee', TransactionManagement.getFee);

module.exports = router;
