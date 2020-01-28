const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const con = require("../models/dbcon");

// var emailPass = process.env.emailPass;
// var emailUser = process.env.emailUser;
// var uri = process.env.URI;
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }); 
// var db=mongoose.connection;

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

module.exports = {
	resetUser: async function resetUser(req, res) {
	try {
		let newpass = await Math.random().toString(16).slice(2, 8);
		console.log(hash(newpass));
		var data = new user({
			email: req.body.email,
			// hash: Date.now() + Math.random().toString(16).slice(2, 14),
		});
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			auth: {
			  user: emailUser, // generated ethereal user
			  pass: emailPass // generated ethereal password
			}
		  });
		  console.log('Reset account sending')
		  let info = await transporter.sendMail({
			from: '"MatchaBot 👻" <Jrheeder@student.wethinkcode.co.za>', // sender address
			to: `${data.email}`, // list of receivers
			subject: "Matcha <RESET PASSWORD> ✔", // Subject line
			text: "Find your lover : key etc", // plain text body
			html: `Hello ${data.email}, your new auto-generated password is : ${newpass}. Please use this to login and change your password manually.`
		  });
		  console.log('Info set')
		//   console.log('mail should be sent\t'+ data.hash);
		newpass = await hash(newpass);
        con.db.collection('user').findOneAndUpdate({ email: req.body.email }, { $set: { password: newpass} });
		} catch(err) {
			console.log("ERROR:")
			console.log(err.message);
		}
		res.render('auth/forgot.ejs', { title: 'Reset' })
	}
}