const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;
const Product = new Schema({
   // _id :{type : String},
    tenSanPham :{type :String ,maxLength : 100},
    image :{type :String,maxLength:255},
    moTa :{type :String,maxLength : 500},
    maLoai :{type :String,maxLength:20},
    tinhTrang :{type :String,maxLength:20},
    soLuongCon:{type :String,maxLength:20},
    slug : {type:String ,slug :'tenSanPham',require:true,unique:true},
  },{
    timestamps : true,
  });

  mongoose.plugin(slug);
  Product.plugin(mongooseDelete,{
    deletedAt :true,
    overrideMethods : 'all',
  });
module.exports = mongoose.model('Products',Product);