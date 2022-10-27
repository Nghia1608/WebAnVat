const express = require('express');
const router = express.Router();


const productsController = require('../app/controllers/ProductController')
const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserAuthorization,
  } = require("../app/controllers/Middleware");

router.get('/create',verifyTokenAndAdmin,productsController.create);
router.post('/store',verifyTokenAndAdmin,productsController.store);

router.get('/:id/edit',verifyTokenAndAdmin,productsController.edit);
router.put('/:id',verifyTokenAndAdmin,productsController.update);

router.patch('/:id/restore',verifyTokenAndAdmin,productsController.restore);
router.delete('/:id/delete',verifyTokenAndAdmin,productsController.delete);


router.delete('/:id',verifyTokenAndAdmin,productsController.softDelete);

router.post('/:id',verifyTokenAndUserAuthorization,productsController.storeProductToCart);


router.get('/:slug',productsController.show);


module.exports = router;