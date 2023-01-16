const express = require('express');
const LeverageOrder = require('../controllers/leverageOrder');

const router = express.Router();

router.get('/getPendingOrders', LeverageOrder.getPendingOrders)

router.put('/stop/:id', LeverageOrder.stop);

router.put('/start', LeverageOrder.start);

router.get('/user-orders/:id', LeverageOrder.userOrders);

//INDEX
router.get('/', LeverageOrder.index);

//STORE
router.post('/add', LeverageOrder.store);

//SHOW
router.get('/:id', LeverageOrder.show);

//UPDATE
router.put('/update', LeverageOrder.update);
// router.put('/update', LeverageOrder.accountsAgainstId);

//DELETE
router.delete('/:id', LeverageOrder.destroy);

// REVERT AN ORDER
router.put('/revert-order/:id', LeverageOrder.revertOrder);

// EDIT HISTORY AN ORDER
router.put('/edit-history-order/:id', LeverageOrder.editHistoryOrder);

module.exports = router;
