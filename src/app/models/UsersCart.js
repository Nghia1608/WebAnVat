const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


mongoose.plugin(slug);

const Schema = mongoose.Schema;
const Cart = new Schema({
    //tt user
    username :{type :String ,maxLength : 50,require:true},
    hoTen :{type :String,maxLength:50,require:true},
    sdt :{type :String,maxLength:12,require:true},
    // tt don hang
    tenSanPham :{type :String ,maxLength : 100},
    soLuong :{type :String ,maxLength :3},
    image :{type :String,maxLength:255},
    idSanPham :{type :String ,maxLength : 100},
    tongTien : {type :String ,maxLength : 100},
    slug : {type :String ,slug : 'tongTien',require:true,unique:true},
    idtest : {type :String,maxLength : 100 },
  },{
    timestamps : true,
  });

module.exports = mongoose.model('carts',Cart);