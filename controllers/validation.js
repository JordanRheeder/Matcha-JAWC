const mongoose = require("mongoose");
const user = require("../models/user.js");
const bcrypt = require('bcrypt');

var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

module.exports = {
	validate: async function validateRegistrationDetails(req, res) {
		var pattern = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
		if (req.body.username) {
			foundUser = await db.collection('user').find(
				{hash: req.body.username}).count();
			if (req.body.username.length < 7 || req.body.username.length > 25 || foundUser > 0 || pattern.test(req.body.username))
				return (false);
			}
		foundEmail = await db.collection('user').find(
			{hash: req.body.email}).count();
		if (req.body.email)
			if (req.body.email.length < 6 || req.body.email.length > 49 || foundEmail > 0)
				return (false);
		if (req.body.password)
			if (req.body.password.length < 8 || req.body.password.length > 255)
				return (false);
		if (req.body.age)
			if (req.body.age < 18)
				return (false);
		return (true);
		// Need only alphabet/numbers function ie no special chars in username
	}
}