const express = require('express');
const FiatCurrency = require('../controllers/fiatCurrency');

const router = express.Router();

//INDEX
router.get('/', FiatCurrency.index);

//STORE
router.post('/add', FiatCurrency.store);

//SHOW
router.get('/:id', FiatCurrency.show);

//UPDATE
router.put('/:id', FiatCurrency.update);

//DELETE
router.delete('/:id', FiatCurrency.destroy);

module.exports = router;
