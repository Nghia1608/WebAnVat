const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController')

const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserAuthorization,
  } = require("../app/controllers/Middleware");

// router.get('/register',UserController.register);
// router.post('/registerUser',UserController.registerUser);

// router.get('/login',UserController.login);
// router.post('/confirmLogin',UserController.confirmLogin);


router.get('/:id/edit',verifyTokenAndUserAuthorization,UserController.edit);
router.put('/:id',verifyTokenAndUserAuthorization,UserController.update);
router.delete('/:id/delete',verifyTokenAndUserAuthorization,UserController.delete);

router.delete('/:id/delete',verifyTokenAndUserAuthorization,UserController.delete);
router.get('/cart',verifyToken,UserController.cart);

router.get('/purchase',verifyTokenAndUserAuthorization,UserController.purchase);



router.get('/storedUsers',verifyTokenAndAdmin,UserController.storedUsers);

module.exports = router;

