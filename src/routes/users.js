const express = require('express');
const router = express.Router();

const UserController = require('../app/controllers/UserController')

router.get('/register',UserController.register);
router.get('/login',UserController.login);
router.post('/confirmLogin',UserController.confirmLogin);
router.get('/private/:token',UserController.private);

router.post('/registerUser',UserController.registerUser);

router.get('/storedUsers',UserController.storedUsers);
router.get('/:id/edit',UserController.edit);
router.put('/:id',UserController.update);
router.delete('/:id/delete',UserController.delete);

module.exports = router;