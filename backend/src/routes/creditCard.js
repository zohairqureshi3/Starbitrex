const express = require('express');
const creditCard = require('../controllers/creditCard');

const router = express.Router();

//INDEX
router.get('/:userId', creditCard.index);

//STORE
router.post('/add', creditCard.store);

//SHOW
router.get('/:id', creditCard.show);

//UPDATE
router.put('/:id', creditCard.update);

//DELETE
router.delete('/:id', creditCard.destroy);

module.exports = router;