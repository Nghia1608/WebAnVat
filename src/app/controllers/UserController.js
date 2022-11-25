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
        Promise.all([ProductsInCart.find({username : req.user.username})
            ,Users.findOne({username : req.user.username})
            ])
        .then(([carts,users])=>{
            res.render('users/cart',{
                users : mongooseToObject(users),
                carts : multipleMongooseToObject(carts),

            }); 
        })
        .catch(next); 
    },
    purchase(req,res,next){
        // if(req.user.quyen =="Admin"){
        //     Promise.all([ProductsToOrder.find({})
        //         ,ProductsDetailToOrder.find({})
        //         ,Users.findOne({username : req.user.username})
        //         ])
        //     .then(([usersorders,usersordersdetails,users])=>{
        //         res.render('users/purchase',{
        //             users : mongooseToObject(users),
        //             usersorders : multipleMongooseToObject(usersorders),
        //             usersordersdetails : multipleMongooseToObject(usersordersdetails),
    
        //         }); 
        //         usersorders.forEach(order=>{     //lap qua cac phan tu trong mang da lay ra
        //             Promise.all([ProductsDetails.findOne({idProduct : order['idSanPham'],size :order['size']})])
        //             .then(async([productsdetails])=>{
        //                     if( productsdetails){
        //                         //Số lượng đã có
        //                         soLuongCurrent = productsdetails.soLuongCon;
        //                         //so lượng reduce
        //                         soLuongReduce = order['soLuong'];
        //                         // tổng sau cộng
        //                         soLuongToTal =parseInt(soLuongCurrent) + parseInt(soLuongReduce);
        //                         //
        //                         if(soLuongToTal>0){
        //                             tinhTrangTotal = "Còn hàng";
        //                         }
        //                         newValues = ({ $set: {soLuongCon :soLuongToTal,tinhTrang : tinhTrangTotal} });
        //                         temp = (productsdetails._id).toString()
        //                         await ProductsDetails.updateOne({_id : temp},newValues)
                                
        //         await ProductsDetailToOrder.delete({maHoaDon : usersorders.maHoaDon})

        //                     }
        //             })
                    
        //         })
        //     })
        //     .catch(next); 
        // }else{
        //     Promise.all([ProductsToOrder.find({username : req.user.username})
        //         ,ProductsDetailToOrder.find({username:req.user.username})
        //         ,Users.findOne({username : req.user.username})
        //         ])
        //     .then(([usersorders,usersordersdetails,users])=>{
        //         res.render('users/purchase',{
        //             users : mongooseToObject(users),
        //             usersorders : multipleMongooseToObject(usersorders),
        //             usersordersdetails : multipleMongooseToObject(usersordersdetails),
    
        //         }); 
        //     })
        //     .catch(next); 
        // }

        ProductsToOrder.aggregate([
            { $match: { deleted: false } },
            { $group: { _id: { $substr: [ "$thoiGianDatHang", 3, 7 ] }, tongTien: { $sum: "$tongTien" } } },
            { $sort: { _id: +1 } },
          ])
            .then((usersorders)=>{
                var valueForMonth = [0,0,0,0,0,0,0,0,0,0,0,0];

                usersorders.forEach(order=>{
                    var month = order['_id'].slice(0,2)
                    valueForMonth[Number(month)-1] = order['tongTien'];
                })
                res.send(valueForMonth)
            })

                
    },
    purchaseForMonth(req,res,next){
        ProductsToOrder.aggregate([
            { $match: { deleted: false } },
            { $group: { _id: { $substr: [ "$thoiGianDatHang", 3, 7 ] }, tongTien: { $sum: "$tongTien" } } },
            { $sort: { _id: +1 } },
          ])
            .then((usersorders)=>{
                var valueForMonth = [0,0,0,0,0,0,0,0,0,0,0,0];

                usersorders.forEach(order=>{
                    var month = order['_id'].slice(0,2)
                    valueForMonth[Number(month)-1] = order['tongTien'];
                })
                return valueForMonth;

            })
    },
    canceledPurchase(req,res,next){
        Promise.all([ProductsToOrder.findDeleted()
            ,ProductsDetailToOrder.findDeleted()
            ,Users.findOne()
            ])
        .then(([usersorders,usersordersdetails,users])=>{
            res.render('users/canceledPurchase',{
                //users : mongooseToObject(users),
                usersorders : multipleMongooseToObject(usersorders),
                usersordersdetails : multipleMongooseToObject(usersordersdetails),

            }); 
        })
        .catch(next); 
    },
    purchaseDetail(req,res,next){
        Promise.all([ProductsDetailToOrder.find({maHoaDon : req.params.id}),ProductsToOrder.findOne({maHoaDon : req.params.id})]) 
                .then(([usersordersdetails,usersorders])=>{
                        res.render('users/purchaseDetail',{
                            usersorders : mongooseToObject(usersorders),
                            usersordersdetails : multipleMongooseToObject(usersordersdetails),
                    }); 
                })
                .catch((next)=>{
                    res.send(next)
                }); 

    },
    canceledPurchaseDetail(req,res,next){
        Promise.all([ProductsDetailToOrder.findDeleted({maHoaDon : req.params.id}),ProductsToOrder.findDeleted({maHoaDon : req.params.id})]) 
                .then(([usersordersdetails,usersorders])=>{
                        res.render('users/canceledPurchaseDetail',{
                            usersorders : multipleMongooseToObject(usersorders),
                            usersordersdetails : multipleMongooseToObject(usersordersdetails),
                    }); 
                })
                .catch((next)=>{
                    res.send(next)
                }); 

    },
}
module.exports = UserController;

