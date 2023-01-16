const express = require('express');
const Permission = require('../controllers/permission');

const router = express.Router();

// DELETE MULTIPLE PERMISSIONS
router.delete('/del-permsissions', Permission.destroyPermissions);

//INDEX
router.get('/', Permission.index);

//STORE
router.post('/add', Permission.store);

// router.get('/', access(["Admin"]), getAll); // admin only
//SHOW
router.get('/:id', Permission.show);

//UPDATE
router.put('/:id', Permission.update);

//DELETE
router.delete('/:id', Permission.destroy);

module.exports = router;