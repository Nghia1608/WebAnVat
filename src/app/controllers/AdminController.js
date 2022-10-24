const Products = require('../models/Products');
const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');
const AdminController={
    // [Post] src/routes/product/store  nhan du lieu tu form Create

    storedProducts(req,res,next){
        Promise.all([Products.find({}),Products.countDocumentsDeleted()])
            .then(([products,deletedProducts])=>{
                res.render('admin/storedProducts',{
                    deletedProducts,
                    products : multipleMongooseToObject(products),

                }); 
            })
            .catch(next); 
    },
    home(req,res,next){
        res.render('admin/home');
    },

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
module.exports =  AdminController;