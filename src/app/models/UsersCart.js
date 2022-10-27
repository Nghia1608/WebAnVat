const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');



const Schema = mongoose.Schema;
const Cart = new Schema({
    //tt user
    username :{type :String ,maxLength : 50,require:true,unique:true},
    hoTen :{type :String,maxLength:50,require:true},
    sdt :{type :String,maxLength:12,require:true},
    // tt don hang
    tenSanPham :{type :String ,maxLength : 100},
    soLuong :{type :String ,maxLength : 100},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('UsersCard',Cart);