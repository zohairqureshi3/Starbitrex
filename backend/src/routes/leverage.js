const express = require('express');
const Leverage = require('../controllers/leverage');

const router = express.Router();

// UPDATE CURRENCY IDS
router.get('/sourcecurrency/:sourceid/:replaceid', Leverage.leveragSourceUpdateByCurrency);
router.get('/destinationcurrency/:destid/:replaceid', Leverage.leveragDestinationUpdateByCurrency);

//INDEX
router.get('/', Leverage.index);

//STORE
router.post('/add', Leverage.store);

//SHOW
router.get('/:id', Leverage.show);

//UPDATE
router.put('/:id', Leverage.update);

//DELETE
router.delete('/:id', Leverage.destroy);

//SHOW LEVERAGE DETAILS AGAINST CURRENCY
router.get('/currency/:id', Leverage.leverageByCurrency);

module.exports = router;
