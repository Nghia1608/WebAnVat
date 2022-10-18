const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);



const User = new Schema({
    username :{type :String ,maxLength : 50,require:true,unique:true},
    password :{type :String,maxLength:50,require:true},
    quyen :{type :String,maxLength : 10,require:true},
  },{
    timestamps : true,
  });

module.exports = mongoose.model('Users',User);