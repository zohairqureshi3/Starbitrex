const express = require('express');
const Role = require('../controllers/role');

const router = express.Router();

//INDEX
router.get('/', Role.index);

//STORE
router.post('/add', Role.store);

// router.get('/', access(["Admin"]), getAll); // admin only
//SHOW
router.get('/:id', Role.show);

//UPDATE
router.put('/:id', Role.update);

//DELETE
router.delete('/:id', Role.destroy);

module.exports = router;
