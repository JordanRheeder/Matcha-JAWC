const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

module.exports = {
	emailPasswordResetLink: async function emailPasswordResetLink(req, res) {
		try {
			
		} catch (error) {
			console.log(error);
		}
	}
}