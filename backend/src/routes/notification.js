const express = require('express');
const Notification = require('../controllers/notification');

const router = express.Router();

//INDEX
router.get('/:type', Notification.index);


//UPDATE
router.put('/:id', Notification.update);


module.exports = router;