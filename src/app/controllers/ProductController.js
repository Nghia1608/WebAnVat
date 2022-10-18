const Products = require('../models/Products');
const {mongooseToObject}= require('../../util/mongoose');


class ProductController{


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
    }

    // [Get] src/routes/product/create  goi form Create

    create(req,res,next){
        res.render('products/create');
    }
    // [Post] src/routes/product/store  nhan du lieu tu form Create

    store(req,res,next){
        const formData = req.body;
        const product = new Products(formData); //models/products
        product.save()
            .then(()=>{
                res.redirect('/admin/storedProducts');
                alert('Thêm sản phẩm thành công !')
            })
            .catch(error=>{
            })
    }
    //[GET]
    edit(req,res,next){
        Products.findById(req.params.id)         
            .then(products=>res.render('products/edit',{
                    products : mongooseToObject(products)

                })) 
            .catch(next);                    
    }
    //[PUT]
    update(req,res,next){
        Products.updateOne({_id : req.params.id},req.body)
            .then(()=>res.redirect('/admin/storedProducts'))
            .catch(next);
    }
    //[SOFT DELETE]
    softDelete(req,res,next){
        Products.delete({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    }
    //[RESTORE]
    restore(req,res,next){
        Products.restore({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    }
    //[DELETE]
    delete(req,res,next){
        Products.deleteOne({_id : req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);                  
    }
}
module.exports = new ProductController;