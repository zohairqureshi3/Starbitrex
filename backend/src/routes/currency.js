const express = require('express');
const Currency = require('../controllers/currency');
const multer = require('multer');

var upload = multer({ dest: "./upload" });

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./upload");
   },
   filename: function (req, file, cb) {
      var fileExtension = file.mimetype.split("/")[1];
      cb(null, "1" + Date.now() + "." + fileExtension);
   },
});

var upload = multer({ storage: storage });

const router = express.Router();

//INDEX
router.get('/', Currency.index);

//STORE
// router.post('/add', upload.single('avatar'), Currency.store);
router.post('/add', Currency.store);

//SHOW
router.get('/:id', Currency.show);

//UPDATE
router.put('/:id', Currency.update);

//DELETE
router.delete('/:id', Currency.destroy);

module.exports = router;
