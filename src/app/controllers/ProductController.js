const Products = require('../models/Products');
const ProductsDetails = require('../models/ProductsDetail');

const ProductsInCart = require('../models/UsersCart');
const ProductsToOrder = require('../models/UsersOrders');
const ProductsDetailToOrder = require('../models/UsersOrdersDetails');
const Users = require('../models/Users');

const {mongooseToObject,multipleMongooseToObject}= require('../../util/mongoose');
const UsersCart = require('../models/UsersCart');


const ProductController={


    // Method Show - Hien thi san pham
    // [Get] src/routes/product/show
    show(req,res,next){
        Promise.all([ProductsDetails.find({idProduct : req.params.id}),Products.findOne({_id : req.params.id})]) 
        .then(([productsdetails,products])=>{
                res.render('products/show',{
                    products : mongooseToObject(products),
                    productsdetails : multipleMongooseToObject(productsdetails),
            }); 
        })
        .catch((next)=>{
            res.send(next)
        }); 
    },

    create(req,res,next){
        res.render('products/create');
    },
    //product detail
    showProductDetail(req,res,next){
        Promise.all([ProductsDetails.find({idProduct : req.params.id}),Products.findOne({_id : req.params.id})]) 
                .then(([productsdetails,products])=>{
                        res.render('products/detail',{
                            products : mongooseToObject(products),
                            productsdetails : multipleMongooseToObject(productsdetails),
                    }); 
                })
                .catch((next)=>{
                    res.send(next)
                }); 

    },
    createDetail(req,res,next){

        Products.findById(req.params.id)         
        .then(products=>res.render('products/createDetail',{
                products : mongooseToObject(products)

            })) 
        .catch(next);   
    },
    storeDetail(req,res,next){
        const formData = req.body;
        const productDetail = new ProductsDetails(formData);

        productDetail.giaTienBanRa = req.body.giaTienBanRa;
        productDetail.tinhTrang = req.body.tinhTrang;
        productDetail.soLuongCon = req.body.soLuongCon;
        productDetail.size = req.body.size;
        productDetail.save()
            .then(()=>{
                res.redirect(`/products/${req.body.id}/detail`);
                alert('Thêm sản phẩm thành công');
            })
            .catch(error=>{
            })
    },
    editDetail(req,res,next){
        ProductsDetails.findById(req.params.id)         
            .then(productsdetails=>res.render('products/editDetail',{
                productsdetails : mongooseToObject(productsdetails)

                })) 
            .catch(next);   
              
    },

    //[PUT]
    updateDetail(req,res,next){
        ProductsDetails.updateOne({_id : req.params.id},req.body)
            .then(()=>res.redirect(`/products/${req.body.idProduct}/detail`)
            )
            .catch(next);

    },
    deleteDetail(req,res,next){
        ProductsDetails.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    },
    // [Post] src/routes/product/store  nhan du lieu tu form Create

    storedProducts(req,res,next){
        Promise.all([Products.find({}),Products.countDocumentsDeleted()])
            .then(([products,deletedProducts])=>{
                res.render('products/storedProducts',{
                    deletedProducts,
                    products : multipleMongooseToObject(products),

                }); 
            })
            .catch(next); 
    },


    trashProducts(req,res,next){
        Products.findDeleted({})
            .then((products)=>{
                res.render('products/trashProducts',{
                    products : multipleMongooseToObject(products),

                }); 
            })
            .catch(next); 
    },

    store(req,res,next){
        const formData = req.body;
        const product = new Products(formData); 
        //save values
        product.tenSanPham = req.body.tenSanPham;
        product.image = req.body.image;
        product.moTa = req.body.moTa;
        product.maLoai  = req.body.maLoai;
        product.tinhTrang = req.body.tinhTrang;

        //
        product.save()
            .then(()=>{
                res.redirect('/products/storedProducts');
                alert('Thêm sản phẩm thành công');
            })
            .catch(error=>{
            })

    },

    //[GET]
    edit(req,res,next){
        Products.findById(req.params.id)         
            .then(products=>res.render('products/edit',{
                    products : mongooseToObject(products)

                })) 
            .catch(next);                    
    },

    //[PUT]
    update(req,res,next){
        Products.updateOne({_id : req.params.id},req.body)
            .then(()=>res.redirect('back'))
            .catch(next);
    },
    //[SOFT DELETE]
    softDelete(req,res,next){
        Products.delete({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    },
    //[RESTORE]
    restore(req,res,next){
        Products.restore({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    },
    //[DELETE]
    delete(req,res,next){
        Products.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    },

    //them san pham vao gio hang
    //POST
    storeProductToCart(req,res,next){       
        //show sp theo id user va id sp               
        Promise.all([ProductsInCart.findOne({idSanPham : req.body.idSP,size :req.body.size,username : req.user.username})])
            .then(([carts])=>{
                    if(carts){
                        
                        //SP đã có trong giỏ =>cộng dồn số lượng
                        //Số lượng đã có
                        let soLuongCurrent = carts.soLuong;
                        let tongTienCurrent = carts.tongTien;

                        //so lượng cộng thêm
                        let soLuongAddIn = req.body.soLuong;
                        let tongTienAddIn = req.body.tongTien;
                        // tổng sau cộng
                        soLuongToTal =parseInt(soLuongCurrent) + parseInt(soLuongAddIn);
                        tongTienToTal = parseInt(tongTienCurrent) + parseInt(tongTienAddIn);
                        //
                        newValues = ({ $set: {soLuong :soLuongToTal, tongTien : tongTienToTal } });
                        
                        ProductsInCart.updateOne({_id : carts._id},newValues)
                        .then(()=>{
                            res.redirect('/users/cart');
            
                            })
                        .catch(next);
                    }else{
                        //SP chưa có trong giỏ =>thêm mới
                        const formData = req.body;
                        const product = new ProductsInCart(formData);
                        product.username = req.user.username;
                        product.hoTen = req.user.username;
                        product.sdt = req.user.username;
                        product.idSanPham = req.body.idSP;
                        product.save()
                            .then(()=>{
                                res.redirect('/users/cart');
                            })
                            .catch(next);
                    }
            })
            .catch((next)=>{
                res.send(next)
            }); 
        //res.send(req.body);
    },

    updateCart(req,res,next){
        //so luong va tien theo ID
         var tempSoLuong = "soLuong"+req.params.id;  //soLuong6367847be736a0b3f32b2d95
         var tempTongTien = "tongTien"+req.params.id;
        //
        var SoLuong = req.body[tempSoLuong];
        var TongTien = req.body[tempTongTien];
        newValues = ({ $set: {soLuong :SoLuong, tongTien : TongTien } });
        //req.params chi lay dc _id
        //req.body = object
        ProductsInCart.updateOne({_id : req.params.id},newValues)
            .then(()=>{
                res.redirect('/users/cart');

                })
            .catch(next);
    },
    deleteCart(req,res,next){
        ProductsInCart.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('/users/cart'))
            .catch(next);                  
    },

    order(req,res,next){
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
            //reduce amout products in DB after order
            
             Promise.all([ProductsDetails.findOne({idProduct : req.body.idSanPham[i],size :req.body.size[i]})])
                .then(async([productsdetails])=>{
                        if(productsdetails){
                            //Số lượng đã có
                            soLuongCurrent = productsdetails.soLuongCon;
                            //so lượng reduce
                            soLuongReduce[i] = req.body.soLuong[i];
                            // tổng sau cộng
                            soLuongToTal =parseInt(soLuongCurrent) - parseInt(soLuongReduce);
                            //
                            newValues = ({ $set: {soLuongCon :soLuongToTal} });
                            temp = (productsdetails._id).toString()
                            await ProductsDetails.updateOne({_id : temp},newValues)
                        }
                })
            //delete products in cart after order

            Promise.all([ProductsInCart.findOne({idSanPham : req.body.idSanPham[i],size :req.body.size[i],username : req.body.username})])
            .then(async([carts])=>{
                if(carts){
                    let temp = (carts._id).toString();
                    //res.send(temp)
                    await ProductsInCart.deleteOne({_id : temp})
                }
            })
        }
        }
        res.redirect('/users/cart')
    },
    deleteCartAfterOrder(req,res,next){
        for(var i =0;i<(req.body.idSanPham).length;i++){

        if((req.body.checked[i])=="true"){
            Promise.all([ProductsInCart.findOne({idSanPham : req.body.idSanPham[i],size :req.body.size[i],username : req.body.username})])
            .then(([carts])=>{
                if(carts){
                    let temp = (carts._id).toString();
                    //res.send(temp)
                    ProductsInCart.deleteOne({_id : temp})
                }else{res.send("khong co")}
    
            })
            .catch(next)
        }
        }    


    res.redirect('/users/cart')

    },
}
module.exports = ProductController;