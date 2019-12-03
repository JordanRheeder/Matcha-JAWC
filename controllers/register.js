const user = require("../models/user.js");

module.exports = {
	register: function registerNewUser(req, res) {
	try {
		const hashedPassword = bcrypt.hash(req.body.password, 10)
		// Grabbing the inputs form data 
		var data = new userSchema({
			firstname: req.body.fname,
			lastname: req.body.sname,
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
			hash: Date.now() + Math.random().toString(16).slice(2, 14),
			gender: req.body.gender,
			sexuality: req.body.sexuality,
		})
		db.collection('user').insertOne(data, function (err, collection) {
			if (err) throw err;
			console.log("Record insterted successfully");
		});
		} catch {
			res.redirect('/');
		}
		console.log(data + " - $data");
	}
}