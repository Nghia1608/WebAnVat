const Users = require('../models/Users');
const Products = require('../models/Products');
const ProductsInCart = require('../models/UsersCart');
const ProductsToOrder = require('../models/UsersOrders');
const ProductsDetailToOrder = require('../models/UsersOrdersDetails');

const { response } = require('express');
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const bcrypt = require("bcrypt");
const {mongooseToObject, multipleMongooseToObject}= require('../../util/mongoose');


const UserController = {
                 

      storedUsers(req,res,next){
        Users.find()
            .then((users)=>{
                res.render('users/storedUsers',{
                    users : multipleMongooseToObject(users),

                }); 
            })
            .catch(next); 
    },        //[GET]
    edit(req,res,next){
        
        Users.findById(req.params.id)         
            .then(users=>res.render('users/editUser',{
                    users : mongooseToObject(users)

                })) 
            .catch(next);                    
    },
    //[PUT]
    update : async (req,res,next)=>{
        const salt = await bcrypt.genSaltSync(10);
        const hashed = await bcrypt.hashSync(req.body.password.toString(), salt);

        req.body.password = hashed;

        //luu thông tin từ form
        
        Users.updateOne({_id : req.params.id},req.body)
            .then(()=>{
                res.redirect('users/storedUsers')
            })
            .catch(next);
    },
    delete(req,res,next){
        Users.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    },

    cart(req,res,next){
        Promise.all([ProductsInCart.find({username : req.user.username}),Users.findOne({username : req.user.username})])
        .then(([carts,users])=>{
            res.render('users/cart',{
                users : mongooseToObject(users),
                carts : multipleMongooseToObject(carts),

            }); 
        })
        .catch(next); 
    },
    order(req,res,next){
        //so luong va tien theo ID
    //     var tempSoLuong = "soLuong"+req.params.id;  //soLuong6367847be736a0b3f32b2d95
    //     var tempTongTien = "tongTien"+req.params.id;
    //    //
    //    var SoLuong = req.body[tempSoLuong];
    //    var TongTien = req.body[tempTongTien];
    //    newValues = ({ $set: {soLuong :SoLuong, tongTien : TongTien } });
    //    //req.params chi lay dc _id
    //    //req.body = object
    //    const formData = req.body;
    //    const productOrder = new ProductsToOrder(formData);
    //    const productOrderDetail = new ProductsDetailToOrder(formData);

    //      //data productOrder table
    //    productOrder.username = req.body.username;
    //    productOrder.hoTen = req.body.hoTen;
    //    productOrder.sdt = req.body.sdt;
    //    productOrder.email = req.body.email;
    //    productOrder.diaChi = req.body.diaChi;
    //    productOrder.note = req.body.diaChi;
    //    productOrder.hinhThucMuaHang = req.body.hinhThucMuaHang;
    //    productOrder.tinhTrang = req.body.tinhTrang;
    
    //      //data productOrderDetail table



    //
    //    product.save()
    //        .then(()=>{
    //            res.redirect('/users/cart');
    //        })
    //        .catch(next);

        res.send(req.body)
    },
}
module.exports = UserController;