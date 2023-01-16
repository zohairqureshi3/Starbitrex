const express = require('express');
const WithdrawFee = require('../controllers/withdrawFee');

const router = express.Router();

//INDEX
router.get('/', WithdrawFee.index);

//STORE
router.post('/add', WithdrawFee.store);

//SHOW
router.get('/:id', WithdrawFee.show);

//UPDATE
router.put('/:id', WithdrawFee.update);

//DELETE
router.delete('/:id', WithdrawFee.destroy);

// GET FEE W.R.T Coin and Network
router.post('/get-fee', WithdrawFee.getFee);


module.exports = router;
