const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true, unique: true},
    username: String,
    password: String,
	hash: String,
	gender: String,
	sexuality: String,
	profilepicture: String
});
module.exports = mongoose.model('user', userSchema);