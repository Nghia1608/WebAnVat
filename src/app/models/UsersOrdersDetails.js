const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UsersOrderDetail = new Schema({
    //tt user
    username :{type :String ,maxLength : 50,require:true},
    //
    maHoaDon : {type :String ,maxLength : 100},
    idSanPham :{type :String ,maxLength : 100},
    tenSanPham :{type :String ,maxLength : 100},
    size:{type :String,maxLength:20},
    soLuong:{type :String,maxLength:20},
    giaTienBanRa :{type :String,maxLength:100},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('UsersOrdersDetails',UsersOrderDetail);