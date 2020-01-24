const user = require("../models/user.js");
const mongoose = require('mongoose');

var uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db=mongoose.connection;

//query database once for all user details and then seperate them out into the ones I want from the frontend or backend

let fakeUser = {};

fakeUser.ID = "0";
fakeUser.verified = true;
fakeUser.interests = "both";
fakeUser.pp = "link to an image";
fakeUser.pp2 = "link to an image";
fakeUser.pp3 = "link to an image";
fakeUser.location = "";
fakeUser.ip = "";
fakeUser.country_name = "South Africa";
fakeUser.region_name = "Western Cape";
fakeUser.city = "Cape Town";
fakeUser.zip_code = "7945";
fakeUser.longitude = "";
fakeUser.tags = "";
fakeUser.firstname = "Alexandra";
fakeUser.lastname = "Pappas";
fakeUser.email= "acp@mailinator.com";
fakeUser.username = "Xandra";
fakeUser.password = "hashed1";
fakeUser.hash = "hash";
fakeUser.gender = "female";
fakeUser.interests = "both";
fakeUser.age = "28";