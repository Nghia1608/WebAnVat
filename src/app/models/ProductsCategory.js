const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductCategory = new Schema({
    tenLoai :{type :String ,maxLength :50, require:true},

});

module.exports = mongoose.model('ProductsCategory',ProductCategory);