const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

var emailPass = process.env.EMAILPASS; //Missing credentials for "PLAIN" if this happens then update your .env to 
var emailUser = process.env.EMAILUSER; // EMAILUSER = 'matchanoreplyjawc@gmail.com'
									   // EMAILPASS = 'Shattered159'


var uri = process.env.URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
var db=mongoose.connection;

module.exports = {
	register: async function registerNewUser(req, res) {
	try {
		const validation = require("./validation.js");
		console.log("Calling validation function\n");
		var validInputs = await validation.validate(req, res);
		console.log("Function finished, are inputs valid: " + validInputs);
		if (validInputs) {
			let hashedpassword = await hash(req.body.password)
			var data = new user({
					firstname: req.body.fname,
					lastname: req.body.sname,
					email: req.body.email,
					username: req.body.username,
					password: hashedpassword,
					hash: Date.now() + Math.random().toString(16).slice(2, 14),
					gender: req.body.gender,
					interests: req.body.interest,
					pp: '',
					age: req.body.age,
				});
				if (data.age < 18) {
					return res.render('auth/register.ejs', {title: 'Register', message: 'You need to be older than 18'})
					// stop();
				}
				if (data.age > 100) {
					return res.render('auth/register.ejs', {title: 'Register', message: 'Invalid age'})
				}
			console.log(emailUser + ' ' + emailPass);
			let transporter = nodemailer.createTransport({
				service: 'gmail',
				host: 'smtp.gmail.com',
				secure: false,
				auth: {
					type: 'login',
					user: emailUser, // generated ethereal user
					pass: emailPass // generated ethereal password
					}, tls: {
						rejectUnauthorized: false
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
					}
				});
				var userMessage = 'Account created, verify your account!';
			} else {
				var userMessage = "Account not created. Inputs are not valid.";
			}
		} catch(err) {
			console.log(err.message);
		}
		console.log(data);
		res.render('auth/register.ejs', { title: 'Register', message: userMessage });
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