const mongoose = require('mongoose');



const Schema = mongoose.Schema;
const UsersOrder = new Schema({
    //tt user
    username :{type :String ,maxLength : 50,require:true},
    // tt don hang
    tongTienTruocGiamGia : {type :String ,maxLength : 100},
    tongTienKhuyenMai : {type :String ,maxLength : 100},
    hinhThucThanhToan : {type :String ,maxLength : 100},
    hinhThucMuaHang : {type :String ,maxLength : 100},
    tongTien : {type :String ,maxLength : 100},
    tinhTrang:  {type :String ,maxLength : 100},
    slug : {type :String ,default : function() {
      return Math.floor(Math.random()*900000000300000000000) + 1000000000000000
    },require:true,unique:true},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('UsersOrders',UsersOrder);