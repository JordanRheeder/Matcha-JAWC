const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userSchema = new Schema({
    firstname: {type: String, trim:true, required: [true, "can't be blank"]},
    lastname: {type: String, trim:true, required: [true, "can't be blank"]},
    email: {type: String, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true, unique: true, trim: true},
    username: {type: String, trim:true, required: [true, "can't be blank"]},
    password: {type: String, trim:true, required: [true, "can't be blank"]},
	hash: {type: String, trim:true, required: [true, "can't be blank"]},
    gender: {type: String, trim:true, required: [true, "can't be blank"]},
    sexuality: {type: String, trim:true, required: [true, "can't be blank"]},
    pp: {type: String, default: '', required: false, trim: true},
    verified: {type: Boolean, default: false, required: false},
    age: {type: String, trim:true, required: [true, "can't be blank"]}
});
module.exports = mongoose.model('user', userSchema);