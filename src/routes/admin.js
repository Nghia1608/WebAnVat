const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController')
const productsController = require('../app/controllers/ProductController')


router.get('/storedProducts',AdminController.storedProducts);
router.post('/store',productsController.store);

router.get('/trashProducts',AdminController.trashProducts);


router.get('/',AdminController.home);



//router.use('/',productsController.index);

module.exports = router;