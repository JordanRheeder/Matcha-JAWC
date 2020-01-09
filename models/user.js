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
    // sexuality needs to be removed.
    sexuality: {type: String, trim:true, required: [true, "can't be blank"]},
    verified: {type: Boolean, default: false, required: false},
    age: {type: String, trim:true, required: [true, "can't be blank"]},
    bio: {type: String, trim:true, required: false},
    interests: {type: Array, trim:true, required: false},
    pp: {type: String, default: '', required: false, trim: true},
    pp2: {type: String, default: '', required: false, trim: true},
    pp3: {type: String, default: '', required: false, trim: true},
    pp4: {type: String, default: '', required: false, trim: true},
    pp5: {type: String, default: '', required: false, trim: true},
    location: {type: JSON, default: '', required: false, trim: true},
    ip: {type: String, default: '', required: false, trim: true},
    fame: {type: String, required: false, defualt: 0, trim:true},
    country: {type: String, required: false, default: "South Africa", trim: true}
});
module.exports = mongoose.model('user', userSchema);