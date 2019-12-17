const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

var emailPass = process.env.emailPass;
var emailUser = process.env.emailUser;
var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

module.exports = {
	register: async function registerNewUser(req, res) {
	try {
		if (validation(req)) {
			let hashedpassword = await hash(req.body.password)
			var data = new user({
					firstname: req.body.fname,
					lastname: req.body.sname,
					email: req.body.email,
					username: req.body.username,
					password: hashedpassword,
					hash: Date.now() + Math.random().toString(16).slice(2, 14),
					gender: req.body.gender,
					interest: req.body.interest,
					pp: '',
				});
			let transporter = nodemailer.createTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				auth: {
					user: emailUser, // generated ethereal user
					pass: emailPass // generated ethereal password
					}
				});
			console.log('Hopefully logged in!??>!?')
			let info = await transporter.sendMail({
					from: '"MatchaBot 👻" <Jrheeder@student.wethinkcode.co.za>', // sender address
					to: req.body.email, // list of receivers
					subject: "Hello New Matcha ✔", // Subject line
					text: "Find your lover : key etc", // plain text body
					html: `Hello ${data.firstname}, click this link to verify your account <button><a href='http://localhost:3000/verify/${data.hash}'>Verify me!</a></button>`
				});
			console.log('mail should be sent\t'+ data.hash);
				db.collection('user').insertOne(data, function (err, collection) {
					if (err) throw err;
					else {
						console.log("Record insterted successfully");
						console.log(data);	
					}
				});
			}
		} catch(err) {
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