const express = require('express');
const Dashboard = require('../controllers/dashboard');

const router = express.Router();

//INDEX
router.get('/', Dashboard.index);
router.get('/get-admin-balance', Dashboard.getAdminBalance); 
router.get('/admin-sent-amount-to-user', Dashboard.adminSentAmountToUser);

module.exports = router;
