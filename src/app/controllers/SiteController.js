const Products = require('../models/Products');
const Users = require('../models/Users');


const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');
const SiteController={

    // [Get] /
    admin(req,res,next){
        res.render('dashboard');
    },

    index(req,res,next){
            Products.find({})
            .then(products =>{
                res.render('home',{
                    products : multipleMongooseToObject(products)
                });
            })
            .catch(next)
    },


    products(req,res,next){

        Products.find({})
            .then(products =>{
                res.render('admin',{
                    products : multipleMongooseToObject(products)
                });
            })
            .catch(next)


    },

    contact(req,res){
        res.render('contact');
    }
}
module.exports = SiteController;