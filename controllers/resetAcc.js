const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const con = require("../models/dbcon");

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
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			auth: {
			  user: EMAILUSER, // generated ethereal user
			  pass: EMAILPASS // generated ethereal password
			}
		  });
		  console.log('Reset account')
		  let info = await transporter.sendMail({
			from: '"MatchaBot 👻" <Jrheeder@student.wethinkcode.co.za>', // sender address
			to: `${data.email}`, // list of receivers
			subject: "Matcha <RESET PASSWORD> ✔", // Subject line
			text: "Warning account password has been changed.", // plain text body
			// html: `Hello ${data.email}, click this link to reset your password <button><a href='http://localhost:3000/reset/${newpass}'>Reset password</a></button>`
		  });
        //   console.log('mail should be sent\t'+ data.hash);
        con.db.collection('user').findOneAndUpdate({ hash: req.body.key }, { $set: { hash: newpass } });
		} catch(err) {
			console.log(err.message);
        }
		res.render('auth/forgot.ejs', { title: 'Reset' })
	}
}