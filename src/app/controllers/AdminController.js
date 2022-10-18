const Products = require('../models/Products');
const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');
class AdminController{
    // [Post] src/routes/product/store  nhan du lieu tu form Create

    storedProducts(req,res,next){
        Products.find({})
            .then((products)=>{
                res.render('admin/storedProducts',{
                    products : multipleMongooseToObject(products),

                }); 
            })
            .catch(next); 
    }
    home(req,res,next){
        res.render('admin/home');
    }

    trashProducts(req,res,next){
        Products.findDeleted({})
            .then((products)=>{
                res.render('admin/trashProducts',{
                    products : multipleMongooseToObject(products),

                }); 
            })
            .catch(next); 
    }
}
module.exports = new AdminController;