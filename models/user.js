const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userSchema = new Schema({
    firstname: {type: String, trim:true, required: [true, "can't be blank"]},
    lastname: {type: String, trim:true, required: [true, "can't be blank"]},
    email: {type: String, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true, unique: true, trim: true},
    username: {type: String, trim:true, required: [true, "can't be blank"]},
    password: {type: String, trim:true, required: [true, "can't be blank"]},
	hash: {type: String, trim:true, required: [true, "can't be blank"]},
    gender: {type: String, trim:true, required: [true, "can't be blank"], lowercase: true},
    verified: {type: Boolean, default: false, required: false},
    age: {type: String, trim:true, required: [true, "can't be blank"]},
    bio: {type: String, trim:true, required: false},
    interests: {type: String, trim:true, required: true, lowercase: true},
    ip: {type: String, default: '', required: false, trim: true},
    fame: {type: String, required: false, defualt: 0, trim:true},
    country_name: {type: String, required: false, default: "South Africa", trim: true},
    region_name: {type: String, required: false, default: "", trim: true},
    city: {type: String, required: false, default: "", trim: true},
    zip_code: {type: String, required: false, default: "", trim: true},
    longitude: {required: false, default: ""},
    latitude: {required: false, default: ""},
    tags: {type: String, required: false, default: "", trim: true},
});
module.exports = mongoose.model('user', userSchema);

