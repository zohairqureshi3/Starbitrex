const express = require('express');
const bankAccount = require('../controllers/bankAccount');

const router = express.Router();

//INDEX
router.get('/:userId', bankAccount.index);

//STORE
router.post('/add', bankAccount.store);

//SHOW
router.get('/:id', bankAccount.show);

//UPDATE
router.put('/:id', bankAccount.update);

//DELETE
router.delete('/:id', bankAccount.destroy);

module.exports = router;