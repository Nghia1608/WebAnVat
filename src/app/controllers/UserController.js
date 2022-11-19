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

        //res.send(req.body)

       const formData = req.body;
       const productOrder = new ProductsToOrder(formData);

         //data productOrder table
       productOrder.username = req.body.username;
       productOrder.hoTen = req.body.hoTen;
       productOrder.sdt = req.body.sdt;
       productOrder.email = req.body.email;
       productOrder.diaChi = req.body.diaChi;
       productOrder.note = req.body.note;
       productOrder.hinhThucMuaHang = req.body.hinhThucMuaHang;
       productOrder.tinhTrang = req.body.tinhTrang;
       productOrder.tongTien = req.body.tongTienGioHang;


       productOrder.save()
 
         //data productOrderDetail table
        for(var i =0;i<(req.body.idSanPham).length;i++){
        if((req.body.checked[i])=="true"){
            const productOrderDetail = new ProductsDetailToOrder(formData);
            productOrderDetail.username = req.body.username;

            productOrderDetail.idSanPham = req.body.idSanPham[i];
            productOrderDetail.tenSanPham = req.body.tenSanPham[i];
            productOrderDetail.size = req.body.size[i];
            productOrderDetail.soLuong = req.body.soLuong[i];
            productOrderDetail.giaTienBanRa = req.body.giaTienBanRa[i];

            productOrderDetail.save();
            // Promise.all([ProductsInCart.findOne({idSanPham : req.body.idSanPham[i],size :req.body.size[i],username : req.body.username})])
            //         .then(([carts])=>{
            //             if(carts){
            //                 ProductsInCart.deleteOne({_id : carts._id})

            //             }else{res.send("khong co")}

            //         })
            //         .catch(next)
        }

        }


         res.redirect('/users/cart')
    },
}
module.exports = UserController;