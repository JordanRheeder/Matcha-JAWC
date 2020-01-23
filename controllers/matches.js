const mongoose = require('mongoose');

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
          var dog = await Object.assign(queryObj, { $or: [{interests: usergender}, {interests: "both"}]});
        if (userinterests == "male" || userinterests == "female")
          var deg = await Object.assign(queryObj, {gender: userinterests});
        
          // console.log(JSON.stringify(dog));
          // console.log(JSON.stringify(deg));

        // exclude users that have already matches with currently logged in user
        // find all users by user.hash
        // put all hashes into array
        // store hashes into object
        // insert object into queryObj

        // const likedUsers = await db.collection('matches').find({}).project({_id: 0, likedUser: 1}).toArray();
        // var orObj = {};
        // console.log(likedUsers);
        // for (i = 0; likedUsers[i]; i++) {
        //     await Object.assign(orObj, likedUsers[i]['likedUser']);
        // }

        // likedUsers.forEach(i => {
        //       Object.assign(orObj, i['likedUser']);
        // });
        // console.log(orObj);
        // //{ $or: [ { <expression1> }, { <expression2> }, 
        // await Object.assign(orObj, {hash: {$or: orObj}});

        
        // console.log('::queryObj:::', queryObj);
        //, username: { $ne: req.session.user.username}, pp: {$ne: ''}
        var X = await db.collection('user').find( queryObj ).project({_id: 0, city: 1, pp: 1, firstname: 1, lastname: 1, username: 1, hash: 1, gender: 1, age: 1, bio: 1, fame: 1}).toArray();
        // console.log("X\n\t"+X);
        return (X);
    },

    matchUsers: async function matchUsers(likedUser, loggedUser) {
        db.collection('matches').insertOne({likedUser: likedUser, loggedUser: loggedUser, blocked: false,});
    }
}