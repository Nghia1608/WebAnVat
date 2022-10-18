const Users = require('../models/Users');
const {mongooseToObject, mongooseToObjectId}= require('../../util/mongoose');
const { response } = require('express');


class UserController{

    login(req,res,next){
        res.render('users/login');
    }
    register(req,res,next){
        res.render('users/register');
    }

}
module.exports = new UserController;