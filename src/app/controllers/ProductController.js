const Products = require('../models/Products');
const ProductsCategory = require('../models/ProductsCategory');
const ProductsInCart = require('../models/UsersCart');

const {mongooseToObject,multipleMongooseToObject}= require('../../util/mongoose');
const UsersCart = require('../models/UsersCart');


const ProductController={


    // Method Show - Hien thi san pham
    // [Get] src/routes/product/show
    show(req,res,next){
        Products.findOne({slug : req.params.slug})
            .then((products)=>{
                res.render('products/show',{
                    products : mongooseToObject(products),

                }); 

            })
            .catch(next); 
    },

    create(req,res,next){
        res.render('products/create');
    },
    // [Post] src/routes/product/store  nhan du lieu tu form Create

    store(req,res,next){
        const formData = req.body;
        const product = new Products(formData); //models/products
        product.save()
            .then(()=>{
                res.redirect('/admin/storedProducts');
                alert('Thêm sản phẩm thành công');
                window.location = '/admin/storedProducts';
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
            .then(()=>res.redirect('/admin/storedProducts'))
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
    storeProductToCart(req,res,next){       //chưa ổn
        //show sp theo id user va id sp
        Promise.all([ProductsInCart.findOne({username : req.user.username,idSanPham : req.body.idSP})])
        .then(()=>{
            const formData = req.body;
            const product = new ProductsInCart(formData); //models/products
            product.username = req.user.username;
            product.hoTen = req.user.username;
            product.sdt = req.user.username;
            product.idSanPham = req.body.idSP;
            product.save()
                .then(()=>{
                    res.redirect('/users/cart');
                })
                .catch(next);
        })
        .catch(next);                  


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
}
module.exports = ProductController;