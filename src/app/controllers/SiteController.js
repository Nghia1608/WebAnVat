const Products = require('../models/Products');
const ProductsToOrder = require('../models/UsersOrders');
const ProductsDetailToOrder = require('../models/UsersOrdersDetails');
const {multipleMongooseToObject}= require('../../util/mongoose');
const SiteController={

    admin1(req,res,next){
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
                res.send(valueForMonth) ;

            })
    },
    // [Get] /
    admin(req,res,next){
        Promise.all([
           // ProductsToOrder.find({}).limit(5)  //limit lấy 5 hóa đơn gần nhât
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
                ProductsDetailToOrder.aggregate([
                    { $match: { deleted: false } },
                    { $group: { _id:  "$tenSanPham" ,thoiGianDatHang: { $substr: [ req.body.thoiGianDatHang, 0, 7 ] }, tongSoLuong: { $sum: "$soLuong" } } },
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
    
                                    });                                 })

                            })

                    })


            })
            //

        })

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