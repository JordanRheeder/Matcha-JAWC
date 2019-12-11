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
			res.status(400).json({ message: 'No data provided' });
		} else {
			const user = await db.collection('user').findOne({ email: email });
			console.log(user);
			if (!user) {
				res.status(404).json({ message: 'User not found' });
			}
			if (user.verified === false)
			{
				return res.status(400).json({ verified: "Please verify your account." });
				// res.redirect('/login');
				// return res.redirect('/');
			}
			try {
				isMatch = await bcrypt.compare(password, user.password);
				if (isMatch) {
					req.session.user = user;
					return res.redirect('/');
				} else {
					return res.status(400).json({ password: 'password incorrect' });
				}
			} catch (error) {
				console.log(error)
				return res.status(500).json({ error, message: 'Something went wrong' });
			}
		}
	}
}