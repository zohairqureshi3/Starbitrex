const express = require('express');
const externalWallet = require('../controllers/externalWallet');

const router = express.Router();

//INDEX
router.get('/:userId', externalWallet.index);

//STORE
router.post('/add', externalWallet.store);

//SHOW
router.get('/:id', externalWallet.show);

//UPDATE
router.put('/:id', externalWallet.update);

//DELETE
router.delete('/:id', externalWallet.destroy);

module.exports = router;
