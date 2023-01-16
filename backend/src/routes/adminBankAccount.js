const express = require('express');
const AdminBankAccount = require('../controllers/adminBankAccount');

const router = express.Router();

//GET DEFAULT BANK ACCOUNT
router.get('/get-default', AdminBankAccount.getDefaultBankAccount);

//SET DEFAULT BANK ACCOUNT
router.put('/set-default/:id', AdminBankAccount.setDefaultBankAccount);

//INDEX
router.get('/', AdminBankAccount.index);

//STORE
router.post('/add', AdminBankAccount.store);

//SHOW
router.get('/:id', AdminBankAccount.show);

//UPDATE
router.put('/:id', AdminBankAccount.update);

//DELETE
router.delete('/:id', AdminBankAccount.destroy);

module.exports = router;