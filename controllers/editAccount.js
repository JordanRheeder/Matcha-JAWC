const mongoose = require("mongoose");
const user = require("../models/user.js");
const bcrypt = require('bcrypt');

var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

const editAccount = {
	editFirstname: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {firstname: req.body.firstname}});
				req.session.user.firstname = req.body.firstname;
		} catch (err) {
			console.log(err);
		}
	},
	editLastname: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {lastname: req.body.lastname}});
				req.session.user.lastname = req.body.lastname;
		} catch (err) {
			console.log(err);
		}
	},

	editEmail: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {email: req.body.email}});
				req.session.user.email = req.body.email;
		} catch (err) {
			console.log(err);
		}
	},

	editUsername: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {username: req.body.username}});
				req.session.user.username = req.body.username;
		} catch (err) {
			console.log(err);
		}
	},

	editPassword: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {password: req.body.password}});
				req.session.user.password = req.body.password;
		} catch (err) {
			console.log(err);
		}
	},

	editGender: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {gender: req.body.gender}});
				req.session.user.gender = req.body.gender;
		} catch (err) {
			console.log(err);
		}
	},

	editInterest: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {interest: req.body.interest}});
				req.session.user.interest = req.body.interest;
		} catch (err) {
			console.log(err);
		}
	},
	
	editAge: async function(req) {
		try {
			await db.collection('user').update(
				{hash: req.session.user.hash},
				{$set: {Age: req.body.age}});
				req.session.user.age = req.body.age;
		} catch (err) {
			console.log(err);
		}
	},

	editAccount: async function(req, res) {
		try {
			// check if current password is correct and validate all inputs into editAccount.edit* functions.
			// hashedPassword = await bcrypt.hash(req.body.password, 10);
			// console.log("Hashed Password: "+hashedPassword+"\n");
			var isValid = require('./validation');
			console.log(req.session.user);
			foundUser = await db.collection('user').find(
				{hash: req.session.user.hash}).count();
			isMatch = await bcrypt.compare(req.body.password, req.session.user.password);
			console.log("Users Found: " + foundUser);
			var validated = await isValid.validate(req, res);
			console.log(validated);
			if (foundUser > 0 && isMatch && validated) {
				// console.log(req.session.user.hash);
				if (req.body.email)
					await editAccount.editEmail(req);
				if (req.body.firstname)
					await editAccount.editFirstname(req);
				if (req.body.lastname)
					await editAccount.editLastname(req);
				if (req.body.email)
					await editAccount.editEmail(req);
				if (req.body.username)
					await editAccount.editUsername(req);
				// if (req.body.password)
				// 	await editAccount.editPassword(req);
				if (req.body.gender)
					await editAccount.editGender(req);
				if (req.body.interest)
					await editAccount.editInterest(req);
				if (req.body.age)
					await editAccount.editAge(req);
				}
				console.log(req.session.user);
			} catch (err){
				console.log(err);
			}
		// }
	}
}

module.exports = editAccount;