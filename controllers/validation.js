const mongoose = require("mongoose");
const con = require('../models/dbcon');

// var uri = process.env.URI;
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }); 
// var db=mongoose.connection;

module.exports = {
	validate: async function validateRegistrationDetails(req, res) {
		console.log("Now in validation function.");
		// password length < 8
		var pattern = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
		if (req.body.username) {
			var foundUser = await con.db.collection('user')
			.count({username: req.body.username});
			console.log("asdf\n");
			// console.log("Same Usernames Found: " + foundUser);
			if (req.body.username.length < 7 || req.body.username.length > 25 || foundUser || pattern.test(req.body.username))
				return (false);
			}
		var foundEmail = await con.db.collection('user')
		.count({email: req.body.email})
			// console.log("Same Emails Found: " + foundEmail);
		if (req.body.email)
			if (req.body.email.length < 6 || req.body.email.length > 49 || foundEmail)
				return (false);
		if (req.body.password)
			if (req.body.password.length < 8 || req.body.password.length > 255)
				return (false);
		if (req.body.age)
			if (req.body.age < 18 || req.body.age > 114)
				return (false);
		return (true);
	}
}