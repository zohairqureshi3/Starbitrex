const express = require('express');
const Country = require('../controllers/country');

const router = express.Router();

//STORE COUNTRIES
router.post('/addCountries', Country.addCountries);

//INDEX
router.get('/', Country.index);

//STORE
router.post('/add', Country.store);

//SHOW
router.get('/:id', Country.show);

//UPDATE
router.put('/:id', Country.update);

//DELETE
router.delete('/:id', Country.destroy);

module.exports = router;