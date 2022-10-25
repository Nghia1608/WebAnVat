const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController')

const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUserAuthorization,
  } = require("../app/controllers/verifyToken");

// router.get('/register',UserController.register);
// router.post('/registerUser',UserController.registerUser);

// router.get('/login',UserController.login);
// router.post('/confirmLogin',UserController.confirmLogin);


router.get('/:id/edit',verifyTokenAndUserAuthorization,UserController.edit);
router.put('/:id',verifyTokenAndUserAuthorization,UserController.update);
router.delete('/:id/delete',verifyTokenAndUserAuthorization,UserController.delete);
router.get('/storedUsers',verifyToken,UserController.storedUsers);

module.exports = router;

