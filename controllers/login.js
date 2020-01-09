const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const getIP = require('external-ip')();
// var geoip = require('geoip-lite');
var ip2location = require('ip-to-location');

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
					await getIP((err, ip) => {
						if (err) {
							// every service in the list has failed
							throw err;
						}
						// set local variable ip and upon login set ip??
						db.collection('user').findOneAndUpdate({ hash: req.session.user.hash }, { $set: { ip: ip } }); {
							if (err) throw(err);
						};
					});
					// const ip = ls.get('IP')
					// console.log(ip);
					// console.log(ip);
					let ip = await db.collection('user').findOne({hash: req.session.user.hash}, {ip: 1})
					console.log(ip.ip);
					ip2location.fetch(ip.ip, function(err, res){
						console.log(res);
						db.collection('user').findOneAndUpdate({ hash: req.session.user.hash }, { $set: { country_name: res.country_name, region_name: res.region_name, city: res.city, zip_code: res.zip_code } }); {
							if (err) throw(err);
						};
						// Okay so we are returned with an object which needs to be put into user-model
					})
					return res.redirect('/');
				} else {
					return res.render('auth/login.ejs', {title: 'Login', message: 'Incorrect Credentials' });
				}
			} catch (error) {
				console.log(error)
				return res.render('auth/login.ejs', { title: 'Login', message: 'Something went wrong, try again...' });
			}
		}
	}
}