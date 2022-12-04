const Products = require('../models/Products');
const Users = require('../models/Users');

const ProductsInCart = require('../models/UsersCart');
const ProductsToOrder = require('../models/UsersOrders');
const ProductsDetailToOrder = require('../models/UsersOrdersDetails');

const {mongooseToObject,multipleMongooseToObject}= require('../../util/mongoose');

const SiteController={

    admin1(req,res,next){
        res.send(req.body)
    },
    // [Get] /
    admin(req,res,next){
        Promise.all([
           ProductsToOrder.aggregate([
                { $match: { deleted: false } },
                { $group: { _id:  "$maHoaDon" , tongTien: { "$first": "$tongTien" },thoiGianDatHang:{ "$first": "$thoiGianDatHang" }, tinhTrang:{ "$first": "$tinhTrang" }} },
                { $sort: { thoiGianDatHang: -1 } },

                ])
            ])
        .then(([usersorders])=>{
            //doanh thu theo thang
            ProductsToOrder.aggregate([
                { $match: { deleted: false } },
                { $group: { _id: { $substr: [ "$thoiGianDatHang", 3, 7 ] }, tongTien: { $sum: "$tongTien" } } },
                { $sort: { _id: -1 } },
                {$limit: 2}
            ])
            .then((usersorders1)=>{
                var tempDate = req.body.thoiGianDatHang;
                ProductsDetailToOrder.aggregate([
                    { $match: { deleted: false ,thoiGianDatHang : tempDate} },
                    { $group: { _id:  "$tenSanPham" ,
                        tongSoLuong: { $sum: "$soLuong" } } },

                    { $sort: { tongSoLuong: -1 } },
                    ])
                    .then((productsHasOrderd)=>{
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
                                ProductsToOrder.aggregate([
                                    { $match: { deleted: false } },
                                    { $group: { _id:  "$maHoaDon" , tongTien: { "$first": "$tongTien" },thoiGianDatHang:{ "$first": "$thoiGianDatHang" }, tinhTrang:{ "$first": "$tinhTrang" }} },
                                    { $sort: { thoiGianDatHang: -1 } },
                                    {$limit: 5}
                    
                                    ])
                                .then((listorder)=>{
                                    res.render('dashboard',{
                                        usersorders : usersorders, //danh sách hóa đơn
                                        usersorders1 : usersorders1, //doanh thu theo tháng
                                        productsHasOrderd : productsHasOrderd ,  //sl sản phẩm bán
                                        valueForMonth : valueForMonth ,
                                        listorder:listorder
    
                                    });              
                                })
                            })
                    })
            })
        })

    },

    index(req,res,next){
        if(req.user?.username){
            Products.find({})
            .then(products =>{
                ProductsInCart.aggregate([
                    { $match: { username: req.user.username } },
                    { $count:  "soSanPhamTrongGioHang" },
                    ])
                .then((soSanPhamTrongGioHang)=>{
                    var idUser = req.user.id;
                    var soSanPham = [0];
                    soSanPhamTrongGioHang.forEach(order=>{
                        soSanPham[0] = order['soSanPhamTrongGioHang'];
                    })
                    res.render('home',{
                        soSanPham : soSanPham,
                        idUser : idUser,
                        products : multipleMongooseToObject(products)
                    });   
                    //res.send(req.user.id)    
                })
            })
        }else{
            Products.find({})
            .then(products =>{
                res.render('home',{
                    products : multipleMongooseToObject(products)
                });
            })
            .catch(next)
        }
///users/{{this._id}}/edit
    },


    contact(req,res){
        res.render('contact');
    }
}
module.exports = SiteController;