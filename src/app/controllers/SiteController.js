const Products = require('../models/Products');
const Users = require('../models/Users');


const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');
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
    search(req,res,next){
        // Products.find({tenSanPham:"Khô gà lá chanh 2"})
        // .then(products =>{
        //     res.render('home',{
        //         products : multipleMongooseToObject(products)
        //     });
        // })
        // .catch(next)
        res.send(req.body)
},
    contact(req,res){
        res.render('contact');
    }
}
module.exports = SiteController;