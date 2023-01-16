const express = require('express');
const InternalOrderHistory = require('../controllers/internalOrderHistory');

const router = express.Router();

// RESOLVE ORDERS
router.get('/resolve-orders', InternalOrderHistory.resolveOrders);

//INDEX
router.get('/', InternalOrderHistory.index);

//STORE
router.post('/add', InternalOrderHistory.store);

//SHOW
router.get('/:id', InternalOrderHistory.show);

//UPDATE
// router.put('/update', InternalOrderHistory.accountsAgainstId);

//DELETE
router.delete('/:id', InternalOrderHistory.destroy);

module.exports = router;
