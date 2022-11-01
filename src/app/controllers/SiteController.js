const Products = require('../models/Products');
const ProductsCategory = require('../models/ProductsCategory');

const {multipleMongooseToObject}= require('../../util/mongoose');

const SiteController={

    // [Get] /
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
    // 
    search(req,res){
        res.render('search');
    }
}
module.exports = SiteController;