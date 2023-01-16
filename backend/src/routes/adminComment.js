const express = require('express');
const AdminComment = require('../controllers/adminComment');

const router = express.Router();

// DELETE MULTIPLE COMMENTS
router.delete('/delete-comments', AdminComment.destroyComments);

// INDEX
router.get('/', AdminComment.index);

// STORE
router.post('/add', AdminComment.store);

// SHOW
router.get('/:id', AdminComment.show);

// UPDATE
router.put('/:id', AdminComment.update);

// DELETE
router.delete('/:id', AdminComment.destroy);

// GET COMMENTS AGAINST A USER
router.get('/get-comments/:id', AdminComment.getUserComments);

module.exports = router;