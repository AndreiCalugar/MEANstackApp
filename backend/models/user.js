const mongoose = require('mongoose');
const uniqueValidator= require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {type: String , require:true , unique: true},
  password: {type: String , require:true , unique: true}

});


userSchema.plugin(uniqueValidator);//provided by mongoose and influances the schema 
module.exports = mongoose.model('User', userSchema);
