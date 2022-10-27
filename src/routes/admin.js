const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController')
const productsController = require('../app/controllers/ProductController')
const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserAuthorization,
  } = require("../app/controllers/Middleware");

router.get('/storedProducts',verifyTokenAndAdmin,AdminController.storedProducts);
router.post('/store',verifyTokenAndAdmin,productsController.store);

router.get('/trashProducts',verifyTokenAndAdmin,AdminController.trashProducts);


router.get('/',verifyTokenAndAdmin,AdminController.home);



//router.use('/',productsController.index);

module.exports = router;