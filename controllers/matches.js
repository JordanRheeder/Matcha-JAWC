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
        var queryObj = {verified: true};
        if (usergender == "male" || usergender == "female")
          await Object.assign(queryObj, { $or: [{interests: usergender}, {interests: "both"}]});
        if (userinterests == "male" || userinterests == "female")
          await Object.assign(queryObj, {gender: userinterests});
        
        
        console.log('::queryObj:::', queryObj);
        //, username: { $ne: req.session.user.username}, pp: {$ne: ''}
        var X = await db.collection('user').find( queryObj ).project({_id: 0, city: 1, pp: 1, firstname: 1, lastname: 1, username: 1, hash: 1, gender: 1, age: 1, bio: 1, fame: 1}).toArray();
        // console.log(X);
        return (X);
        },

        matchUsers: async function matchUsers(likedUser, loggedUser) {
            db.collection('matches').insertOne({likedUser: likedUser, loggedUser: loggedUser, blocked: false,});
        }
    }