const Products = require('../models/Products');

const ProductsInCart = require('../models/UsersCart');

const {mongooseToObject}= require('../../util/mongoose');
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

            // Promise.all([Products.findOne({}),ProductsDetails.findOne({})])
            // .then(([products,productsdetails])=>{
            //     res.render('products/show',{
            //         products,productsdetails : mongooseToObject(products,productsdetails),


            //     }); 
            // })
            // .catch(next); 
    },

    // [Get] src/routes/product/create  goi form Create

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
    storeProductToCart(req,res,next){

        // san pham da co 

        ProductsInCart.find({username : req.user.username })
        .then(()=>{
            ProductsInCart.find({idSanPham :req.body._id})
            .then(()=>{
                console.log('test ok')
            })
            .catch(()=>{    // san pham chua
                const formData = req.body;
                const product = new ProductsInCart(formData); //models/products
                // tt ca nhan
                product.username = req.user.username;
                product.hoTen = req.user.username;
                product.sdt = req.user.username;
        
                product.save()
                    .then(()=>{
                        res.redirect('/');
                    })
                    .catch(error=>{
                    })
            });
        })
        // san pham da co => update so luong
    },
    updateCart(req,res,next){
        ProductsInCart.updateOne({_id : req.params.id},req.body)
            .then(()=>res.redirect('/users/cart'))
            .catch(next);
    },
    deleteCart(req,res,next){
        ProductsInCart.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('/users/cart'))
            .catch(next);                  
    },
}
module.exports = ProductController;