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
        // if user.interest is "other", find by both genders and users who are interested in user.gender
        // if user.interest is "male/female", find by single gender and users who are interested in user.gender
        //user interest
        userinterests = req.session.user.interests;
        //user gender
        usergender = req.session.user.gender;
        // console.log(userinterests+'\n'+usergender);
        var queryObj = {verified: true};
        // We need to only see users who are verified.
      // console.log(JSON.stringify(queryObj));
        
        if (usergender == "male" || usergender == "female")
          await Object.assign(queryObj, { $or: [{interests: usergender}, {interests: "both"}]});
        if (userinterests == "male" || userinterests == "female")
          await Object.assign(queryObj, {gender: userinterests});
          // console.log('::queryObj:::', queryObj);
          // console.log(JSON.stringify(dog));
          // console.log(JSON.stringify(deg));
        // exclude users that have already matched with currently logged in user
        // find all users by user.hash
        // put all hashes into array
        // store hashes into object
        // insert object into queryObj to exclude all already matched users
        // const likedUsers = await con.db.collection('matches').find({loggedUser: req.session.user.hash}).project({_id: 0, likedUser: 1}).toArray();
        // var orObj = {};
        // console.log(likedUsers);
        // for (i = 0; likedUsers != null; i++) {
        //     await Object.assign(orObj, likedUsers);
        // }
        // console.log(orObj);
        // likedUsers.forEach(i => {
        //       Object.assign(orObj, i['likedUser']);
        // });
        // console.log(orObj);
        // //{ $or: [ { <expression1> }, { <expression2> }, 
        // await Object.assign(orObj, {hash: {$or: orObj}});
        //, username: { $ne: req.session.user.username}, pp: {$ne: ''}
        // await Object.assign(queryObj, {$ne: {$or: orObj}});
        // console.log('::queryObj:::', queryObj);
        var X = await con.db.collection('user').find( queryObj ).project({_id: 0, city: 1, pp: 1, firstname: 1, lastname: 1, username: 1, hash: 1,
          gender: 1, age: 1, bio: 1, fame: 1, ip: 1, interests: 1}).toArray();
        for (let key in JSON.stringify(X)) {
          if (X[key] !== 'undefined' && X[key] != null && X[key] != undefined) {
            var propValue = X[key];
            try {
              console.log(key,propValue)
              if (propValue.ip && propValue.username && propValue.ip != '' && propValue.username != '' && X[key] && propValue) {
                ip2location.fetch(propValue.ip, function(err, res){
                  let dog = X[key].username;
                  console.log(dog);
                  let theirLongitude = res.longitude;
                  let theirLatitude = res.latitude;
                  // calculate distances
                  function distance(lat1, lon1, lat2, lon2) {
                    var R = 6371; // Radius of the earth in km
                    var dLat = (lat2 - lat1) * Math.PI / 180; // deg2rad below
                    var dLon = (lon2 - lon1) * Math.PI / 180;
                    var a =
                    0.5 - Math.cos(dLat) / 2 +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    (1 - Math.cos(dLon)) / 2;
                    
                    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  }
                  
                  let dist = distance(req.session.user.latitude, req.session.user.longitude, theirLatitude, theirLongitude)
                  let matched = { name: X[key].username, age: X[key].age, dist: Math.trunc(dist)+" km", gender: X[key].gender}
                  // console.log(dist + 'km');
                  // console.log(res.longitude, res.latitude);
                  console.log(matched);
                {
                  if (err) throw(err);
                };
              });
          }} catch {
            console.log('sheeeieiiiitetet')}
          };
      };
        return (X);
    },
    matchUsers: async function matchUsers(likedUser, loggedUser) {
      // var alreadyLiked = await con.db.collection('matches').count({likedUser: likedUser, loggedUser: loggedUser});
      // if (alreadyLiked == 0)
        con.db.collection('matches').insertOne({likedUser: likedUser, loggedUser: loggedUser, blocked: false,});
    }
}