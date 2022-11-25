const Users = require('../models/Users');
const ProductsDetails = require('../models/ProductsDetail');

const ProductsInCart = require('../models/UsersCart');
const ProductsToOrder = require('../models/UsersOrders');
const ProductsDetailToOrder = require('../models/UsersOrdersDetails');

const { response } = require('express');
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const bcrypt = require("bcrypt");
const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');
const SiteController={

    // [Get] /
    admin(req,res,next){
        Promise.all([ProductsToOrder.find({})
            ,ProductsDetailToOrder.find({})
            ])
        .then(([usersorders,usersordersdetails,users])=>{
            ProductsToOrder.aggregate([
                { $match: { deleted: false } },
                { $group: { _id: { $substr: [ "$thoiGianDatHang", 3, 7 ] }, tongTien: { $sum: "$tongTien" } } },
                { $sort: { _id: +1 } },
              ])
                .then((usersorders1)=>{
                    var valueForMonth = [{},{},{},{},{},{},{},{},{},{},{},{}];
    
                    usersorders1.forEach(order=>{
                        var month = order['_id'].slice(0,2)
                        valueForMonth[Number(month)-1] = JSON.parse(order['tongTien']);
    
                    })
                    res.render('dashboard',{
                        users : mongooseToObject(users),
                        usersorders : multipleMongooseToObject(usersorders),
                        usersordersdetails : multipleMongooseToObject(usersordersdetails),
                        usersorders1 : usersorders1,
                        
                    }); 
                })
            //

        })
        .catch(next); 




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