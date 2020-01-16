const user = require("../models/user.js");
const mongoose = require('mongoose');

var uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db=mongoose.connection;

// get users pics from database
// var userPics = db.collection('user').find({username}).project({pp:1, pp2:1, pp3:1, pp4:1, pp5:1})

//or query database once for all user details and then seperate them out into the ones I want from the frontend?
