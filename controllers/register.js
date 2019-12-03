const user = require("../models/user.js");
const mongoose = require('mongoose');	
var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

module.exports = {
	register: async function registerNewUser(req, res) {
	try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
		var data = new user({
			firstname: req.body.fname,
			lastname: req.body.sname,
			email: req.body.email,
			username: req.body.username,
			password: hashedPassword,
			hash: Date.now() + Math.random().toString(16).slice(2, 14),
			gender: req.body.gender,
			sexuality: req.body.sexuality
		});
		db.collection('user').insertOne(data, function (err, collection) {
			if (err) throw err;
			console.log("Record insterted successfully");
		});
		} catch {
			res.redirect('/');
			console.log('error catch');
		}
		console.log(data);
	}
}