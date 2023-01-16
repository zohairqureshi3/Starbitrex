const express = require('express');
const AdminAddress = require('../controllers/adminAddress');

const router = express.Router();

//GET DEFAULT Admin Address
router.get('/get-default', AdminAddress.getDefaultAdminAddress);

//GET Admin Addresses filtered by currency and network
router.get('/:netId/:currId', AdminAddress.networkAdminAddresses);
router.put('/set-default-network/:id', AdminAddress.setDefaultNetworkAdminAddress);

//SET DEFAULT Admin Address
router.put('/set-default/:id', AdminAddress.setDefaultAdminAddress);

//INDEX
router.get('/', AdminAddress.index);

//STORE
router.post('/add', AdminAddress.store);

//SHOW
router.get('/:id', AdminAddress.show);

//UPDATE
router.put('/:id', AdminAddress.update);

//DELETE
router.delete('/:id', AdminAddress.destroy);

module.exports = router;