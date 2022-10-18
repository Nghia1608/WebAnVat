const express = require('express');
const router = express.Router();


const productsController = require('../app/controllers/ProductController')


router.get('/create',productsController.create);
router.post('/store',productsController.store);

router.get('/:id/edit',productsController.edit);
router.put('/:id',productsController.update);

router.patch('/:id/restore',productsController.restore);
router.delete('/:id/delete',productsController.delete);


router.delete('/:id',productsController.softDelete);


router.get('/:slug',productsController.show);


module.exports = router;