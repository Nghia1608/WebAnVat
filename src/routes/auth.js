const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController')

const { verifyToken } = require("../app/controllers/Middleware");

//REGISTER
router.get('/register',AuthController.register);
router.post('/registerUser', AuthController.registerUser);

//REFRESH TOKEN
router.post('/refresh', AuthController.requestRefreshToken);
//LOG IN
router.get('/login',AuthController.login);
router.post('/confirmLogin',AuthController.confirmLogin);
//LOG OUT
router.post('/logout', verifyToken, AuthController.logOut);

module.exports = router;