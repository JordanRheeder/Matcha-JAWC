const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const con = require('../models/dbcon');

function hash(password)
{
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err)
				reject(err)
			resolve(hash)
		});
	})
}

module.exports = {
	setNewPassword: async function (req, res) {
        console.log(req.body);
        const user = await con.db.collection('user').findOne({ hash: req.session.user.hash }, {projection: {_id: 0, profilePicture: 0}});
        try {
            isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                newpass = await hash(req.body.newpassword);
                await con.db.collection('user').findOneAndUpdate({hash: req.session.user.hash}, {$set: {password: newpass}});
            }
        } catch (e) {
            if (e)
                throw (e);
        }
    }
}