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
	login: async function loginUser(req, res) {
		const email = req.body.email;
		const password = req.body.password;
		console.log({ email, password });
		if (!email || !password) {
			res.render('auth/login.ejs', { title: 'Login', message: 'No data provided' });
		} else {
			const user = await db.collection('user').findOne({ email: email });
			if (!user) {
				return res.render('auth/login.ejs', { title: 'Login', message: 'Incorrect Credentials' });
			}
			if (user.verified === false)
			{
				return res.render('auth/login.ejs', { title: 'Login', message: "Please verify your account" });
			}
			try {
				isMatch = await bcrypt.compare(password, user.password);
				if (isMatch) {
					req.session.user = user;
					return res.redirect('/');
				} else {
					return res.render('auth/login.ejs', {title: 'Login', message: 'Incorrect Credentials' });
				}
			} catch (error) {
<<<<<<< HEAD
				console.log("==========" + error + "==========")
				return res.status(500).json({ error, message: 'Something went wrong' });
=======
				console.log(error)
				return res.render('auth/login.ejs', { title: 'Login', message: 'Something went wrong, try again...' });
>>>>>>> 19b1dbde7d8210025b9409ecaa44a92780d44ab1
			}
		}
	}
}