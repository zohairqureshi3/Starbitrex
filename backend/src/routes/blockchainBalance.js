const express = require('express');
const BlockchainBalance = require('../controllers/blockchainBalance');

const router = express.Router();


// transferAmounts
// router.post('/transferAmounts', BlockchainBalance.transferAmounts);

//INDEX
router.get('/', BlockchainBalance.index);

//STORE
router.post('/add', BlockchainBalance.store);

//SHOW
router.get('/:id', BlockchainBalance.show);

//UPDATE
// router.put('/update', BlockchainBalance.BlockchainBalancesAgainstId);

//DELETE
router.delete('/:id', BlockchainBalance.destroy);

module.exports = router;
