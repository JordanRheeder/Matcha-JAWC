const mongoose = require("mongoose");

var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

module.exports = {
	validate: async function validateRegistrationDetails(req, res) {
		console.log("Now in validation function.");
		var pattern = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
		if (req.body.username) {
			foundUser = await db.collection('user').find(
				{hash: req.body.username}).count();
			console.log("Same Usernames Found: " + foundUser);
			if (req.body.username.length < 7 || req.body.username.length > 25 || foundUser > 0 || pattern.test(req.body.username))
				return (false);
			}
		foundEmail = await db.collection('user').find(
			{hash: req.body.email}).count();
			console.log("Same Emails Found: " + foundEmail);
		if (req.body.email)
			if (req.body.email.length < 6 || req.body.email.length > 49 || foundEmail > 0)
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