const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UsersOrder = new Schema({
    //tt user
    username :{type :String ,maxLength : 50,require:true},
    //
    maHoaDon : {type :String ,maxLength : 100},
    tenSanPham :{type :String ,maxLength : 100},
    soLuong:{type :String,maxLength:20},
    giaTien :{type :String,maxLength:100},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('UsersOrdersDetail',UsersOrderDetail);