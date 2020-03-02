// const mongoose = require('mongoose');
const app = require('../app');
const con = require('../models/dbcon');
const getIP = require('external-ip')();
const ip2location = require('ip-to-location');
// var uri = process.env.URI;
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
// });
// var db=mongoose.connection;

module.exports = {
    findUsers: async function findPotentialMatches(req, res) {
        userinterests = req.session.user.interests;
        usergender = req.session.user.gender;
        var queryObj = {verified: true};
          await Object.assign(queryObj, { $or: [{interests: usergender}, {interests: "both"}]});
        if (userinterests == "male" || userinterests == "female")
          await Object.assign(queryObj, {gender: userinterests});
        var X = await con.db.collection('user').find( queryObj ).project({_id: 0, city: 1, pp: 1, firstname: 1, lastname: 1, username: 1, hash: 1,
          gender: 1, age: 1, bio: 1, fame: 1, ip: 1, interests: 1}).toArray();
        // console.log("Before ret"+returnObj)
        return (X);
    },
}