const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true, unique: true},
    username: String,
    password: String,
    hash: String,
    sexuality: String,
    profileImage: { data: Buffer, contentType: String}
});

mongoose.model('User', userSchema);