// const user = require("../models/user.js");
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
		const email= req.body.email;
		const password = req.body.password;
		// console.log({email, password});
		if (!email || !password) {
			res.status(400).json({ message: 'No data provided' });
		} else {
			const user = await db.collection('user').findOne({ email: email });
			// console.log("\n");
			// console.log(user);
			// console.log("\nUser logged in successfully.\n");
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			try {
				isMatch = await bcrypt.compare(password, user.password);
				if (isMatch) {
					req.session.user = user;
					return res.redirect('/')
				} else {
					return res.status(400).json({ password: 'password incorrect' });
				}
			} catch (error) {
				console.log("==========" + error + "==========")
				return res.status(500).json({ error, message: 'Something went wrong' });
			}
		}
	}
}