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
router.get('/:id/detail',verifyTokenAndAdmin,productsController.detail);

router.put('/:id',verifyTokenAndAdmin,productsController.update);
//update so luong san pham trong kho khi đặt hàng


router.patch('/:id/restore',verifyTokenAndAdmin,productsController.restore);
router.delete('/:id/delete',verifyTokenAndAdmin,productsController.delete);


router.delete('/:id',verifyTokenAndAdmin,productsController.softDelete);

router.post('/:id',verifyToken,productsController.storeProductToCart);
router.put('/:id/updateCart',verifyToken,productsController.updateCart);
router.delete('/:id/deleteCart',verifyToken,productsController.deleteCart);

//router.get('/category/:id',productsController.caterogy);

router.get('/:slug',productsController.show);


module.exports = router;