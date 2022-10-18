const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductDetail = new Schema({
    giaTienBanRa :{type :String ,maxLength : 10},
    giaTriDonViTinh :{type :String,maxLength:255},
    maDonViTinh :{type :String,maxLength : 10},

  });

module.exports = mongoose.model('ProductsDetail',ProductDetail);