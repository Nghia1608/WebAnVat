const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductDetail = new Schema({
    giaTienBanRa :{type :String ,maxLength : 10},
    soLuongCon :{type :String ,maxLength : 10},
    tinhTrang :{type :String ,maxLength : 10},
    idProduct : {type :String ,maxLength : 100},
  });

module.exports = mongoose.model('ProductsDetail',ProductDetail);