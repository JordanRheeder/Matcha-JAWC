const mongoose = require("mongoose");
const user = require("../models/user.js");

var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

const editAccount = {
	editFirstname: async function(firstname) {
		db.collection('user').update(
			{username: "Hallocoos"},
			{$set: {firstname: firstname}});
		// 	,
		// 	{$set: {firstname: firstname}},
		// 	function (err, result) {
		// 		if (err)
		// 			console.log(err.message);
		// 		else
		// 			console.log(result);
		// }
	},
	editLastname: async function(lastname) {
		db.collection('user').update(
			{username: "Hallocoos"},
			{$set: {lastname: lastname}});
	},

	editEmail: async function(email) {
		db.collection('user').update(
			{username: "Hallocoos"},
			{$set: {email: email}});
	},

	editUsername: async function(username) {
		db.collection('user').update(
			{username: "Hallocoos"},
			{$set: {username: username}});
	},

	editPassword: async function(password) {
		db.collection('user').update(
			{username: "Hallocoos"},
			{$set: {password: password}});
	},

	editGender: async function(gender) {
		db.collection('user').update(
			{username: "Hallocoos"},
			{$set: {gender: gender}});
	},

	editInterest: async function(interest) {
		db.collection('user').update(
			{username: "Hallocoos"},
			{$set: {interest: interest}});
	},

	editAccount: async function(req, res) {
		if (req.body.email) {
			try {
				// check if current password is correct and validate all inputs into editAccount.edit* functions.
				// if () {
				if (req.body.firstname)
					await editAccount.editFirstname(req.body.firstname);
				if (req.body.lastname)
					await editAccount.editLastname(req.body.lastname);
				if (req.body.email)
					await editAccount.editEmail(req.body.email);
				if (req.body.username)
					await editAccount.editUsername(req.body.username);
				// if (req.body.password)
				// 	await editAccount.editPassword(req.body.password);
				if (req.body.gender)
					await editAccount.editGender(req.body.gender);
				if (req.body.interest)
					await editAccount.editInterest(req.body.interest);
			// }
			} catch (err){
				console.log(err);
			}
		}
		db.close();
		res.redirect('/');
	}
}

module.exports = editAccount;