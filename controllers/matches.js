const user = require("../models/user.js");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

var emailPass = process.env.EMAILPASS;
var emailUser = process.env.EMAILUSER;
var uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
var db=mongoose.connection;

module.exports = {
    findUsers: async function findPotentialMatches(req, res) {
        // matches should be done by geography, tags, popularity
        // var users = await db.collection('user').find();
        var users = await db.collection('user').find( {city: "Cape Town"} ).toArray()
        console.log(users);
  }
}