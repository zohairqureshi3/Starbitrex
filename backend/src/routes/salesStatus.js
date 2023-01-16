const express = require('express');
const SalesStatus = require('../controllers/salesStatus');

const router = express.Router();

//INDEX
router.get('/', SalesStatus.index);

//STORE
router.post('/add', SalesStatus.store);

//SHOW
router.get('/:id', SalesStatus.show);

//UPDATE
router.put('/:id', SalesStatus.update);

//DELETE
router.delete('/:id', SalesStatus.destroy);

module.exports = router;