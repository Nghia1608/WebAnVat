const mongoose = require('mongoose');



const Schema = mongoose.Schema;
const CartDetail = new Schema({
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
    slug : {type :String ,default : function() {
      return Math.floor(Math.random()*900000000300000000000) + 1000000000000000
    },require:true,unique:true},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('carts',Cart);