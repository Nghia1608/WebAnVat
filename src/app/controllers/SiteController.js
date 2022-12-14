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
        // Promise.all([
           ProductsToOrder.aggregate([
                { $match: { deleted: false } },
                { $group: { _id: { $substr: [ "$thoiGianDatHang", 3, 7 ] }
                , maHoaDon: {$push: "$maHoaDon" } 
            }},
                { $sort: { _id: -1 } },
                {$limit: 2}

                ])
        .then((soHoaDon2ThangGanNhat)=>{
            //doanh thu theo thang
            ProductsToOrder.aggregate([
                { $match: { deleted: false } },
                { $group: { _id: { $substr: [ "$thoiGianDatHang", 3, 7 ] }, tongTien: { $sum: "$tongTien" } } },
                { $sort: { _id: -1 } },
                {$limit: 2}
            ])
            .then((doanhThuTheo2ThangGanNhat)=>{
                var tempDate = req.body.thoiGianDatHang;
                ProductsDetailToOrder.aggregate([
                    { $match: { deleted: false ,thoiGianDatHang : tempDate} },
                    { $group: { _id:  "$tenSanPham" ,
                        tongSoLuong: { $sum: "$soLuong" } } },

                    { $sort: { tongSoLuong: -1 } },
                    ])
                    .then((soLuongSanPham)=>{
                        ProductsToOrder.aggregate([
                            { $match: { deleted: false } },
                            { $group: { _id: { $substr: [ "$thoiGianDatHang", 3, 7 ] }, tongTien: { $sum: "$tongTien" } } },
                            { $sort: { _id: +1 } },
                            
                          ])
                            .then((danhSachHoaDonTheoThang)=>{
                                var doanhThuCacThangTrongNam = [0,0,0,0,0,0,0,0,0,0,0,0];
                
                                danhSachHoaDonTheoThang.forEach(order=>{
                                    var month = order['_id'].slice(0,2)
                                    doanhThuCacThangTrongNam[Number(month)-1] = order['tongTien'];
                                })
                                ProductsToOrder.aggregate([
                                    { $match: { deleted: false } },
                                    { $group: { _id:  "$maHoaDon" , tongTien: { "$first": "$tongTien" },thoiGianDatHang:{ "$first": "$thoiGianDatHang" }, tinhTrang:{ "$first": "$tinhTrang" }} },
                                    { $sort: { thoiGianDatHang: -1 } },
                                    {$limit: 5}
                    
                                    ])
                                .then((danhSachHoaDonGanNhat)=>{
                                    res.render('dashboard',{
                                        doanhThuTheo2ThangGanNhat : doanhThuTheo2ThangGanNhat, //doanh thu theo th??ng g???n nh???t
                                        soLuongSanPham : soLuongSanPham ,  //sl s???n ph???m b??n
                                        doanhThuCacThangTrongNam : doanhThuCacThangTrongNam , // d??? li???u bi???u ?????
                                        danhSachHoaDonGanNhat:danhSachHoaDonGanNhat, //danh s??ch h??a ????n ????? hi???n th???
                                        soHoaDon2ThangGanNhat : soHoaDon2ThangGanNhat,
    
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