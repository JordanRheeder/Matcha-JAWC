const user = require("../models/user.js");
const mongoose = require('mongoose');

var uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db=mongoose.connection;

//query database once for all user details and then seperate them out into the ones I want from the frontend or backend
