const express = require('express');
const Network = require('../controllers/network');

const router = express.Router();

//INDEX
router.get('/', Network.index);

//STORE
router.post('/add', Network.store);

// router.get('/', access(["Admin"]), getAll); // admin only
//SHOW
router.get('/:id', Network.show);

//UPDATE
router.put('/:id', Network.update);

//DELETE
router.delete('/:id', Network.destroy);

module.exports = router;
