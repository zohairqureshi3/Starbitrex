const express = require('express');
const PermissionsModule = require('../controllers/permissionsModule');

const router = express.Router();

// GET MODULE WITH PERMISSIONS
router.get('/get-module-with-permissions', PermissionsModule.getModuleWithPermissions);

//INDEX
router.get('/', PermissionsModule.index);

//STORE
router.post('/add', PermissionsModule.store);

// router.get('/', access(["Admin"]), getAll); // admin only
//SHOW
router.get('/:id', PermissionsModule.show);

//UPDATE
router.put('/:id', PermissionsModule.update);

//DELETE
router.delete('/:id', PermissionsModule.destroy);

module.exports = router;