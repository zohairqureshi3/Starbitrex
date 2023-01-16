const express = require('express');
const SpotOrder = require('../controllers/spotOrder');

const router = express.Router();

router.get('/getPendingOrders', SpotOrder.getPendingOrders)

router.put('/stop/:id', SpotOrder.stop);

router.put('/complete/:id', SpotOrder.complete);

router.get('/user-orders/:id', SpotOrder.userOrders);

// RESOLVE ORDERS
// router.get('/resolve-orders', SpotOrder.ordersCron);

//INDEX
router.get('/', SpotOrder.index);

//STORE
router.post('/add', SpotOrder.store);

//SHOW
router.get('/:id', SpotOrder.show);

//UPDATE
router.put('/update', SpotOrder.update);
// router.put('/update', SpotOrder.accountsAgainstId);

//DELETE
router.delete('/:id', SpotOrder.destroy);

module.exports = router;
