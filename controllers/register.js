const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

module.exports = {
	register: async function registerNewUser(req, res) {
		try {
			let hashedpassword = await hash(req.body.password)
			var data = new user({
				firstname: req.body.fname,
				lastname: req.body.sname,
				email: req.body.email,
				username: req.body.username,
				password: hashedpassword,
				hash: Date.now() + Math.random().toString(16).slice(2, 14),
				gender: req.body.gender,
				sexuality: req.body.sexuality,
				profilepicture: req.body.profilepicture
			});
			db.collection('user').insertOne(data, function (err, collection) {
			console.log("Record insterted successfully");
			});
		} catch(err) {
			res.redirect('/');
			console.log(err.message);
		}
		console.log(data);
	}
}

function hash(password)
{
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err)
				reject(err)
			resolve(hash)
		});
	})
}