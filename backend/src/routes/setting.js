const express = require('express');
const Setting = require('../controllers/setting');

const router = express.Router();

//INDEX
router.get('/', Setting.index);

//STORE
router.post('/add', Setting.store);

// router.get('/', access(["Admin"]), getAll); // admin only
//SHOW
router.get('/:id', Setting.show);

//UPDATE
router.put('/', Setting.update);

//DELETE
router.delete('/:id', Setting.destroy);

module.exports = router;
