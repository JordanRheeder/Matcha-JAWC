// Strategy:
//      Req.body.hash from hidden input then do a query on their profile - working console logging it out.
//      Make mongoquery to see if we are liked by that user we just liked, if not make an object to say we liked them.
//      So when they like us the check can happen and then we can fire off a redirect to chat and create the sockets using the hash.
//      Once query is returned we will check the liked table by this user and if they have liked the user
//      we will then create the socket if it's a 'match'
//      Otherwise if they haven't liked us, then we will create a liked object.
//      
//      we also need to manage blocked in location.js as it's run upon our get method. 
//      So we can prevent them from seeing blocked users.
//      
const mongoose = require('mongoose');
const app = require('../app');
const con = require('../models/dbcon');
const uri = process.env.URI;



// 
mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
const db=mongoose.connection;
// 


//
//id: 5e2d145fae1cf06976d5d1a0
// likedUser:1579167826126ff4ae24ec7c5
// likedUserCheck: false by default
// loggedUser:1578924556737c24f9ae8312f
// loggedUserCheck: true by default
// 
// 
// blocked:false *Not needed*

module.exports = {
    
    matchUser: async function potentialMatchUser(req, res) {
        console.log("button works",req.body.hash);
        // first make the like for user Y by user X
        // await Object.assign(queryObj, { $or: [{interests: usergender}, {interests: "both"}]});
        await db.collection('matches').updateOne(
            // likedby(them): our hash , likes(us): their hash
            { $set: {   likedBy: req.session.user.hash,
                        likedByCheck: false,
                        likes: req.body.hash,
                        likesCheck: true } },
            { upsert: true }
        );
        // check if user Y has liked user X

        // const findPotentialMatch = function(db, cb) {
        //     // Get the documents collection
        //     const collection = db.collection('matches');
        //     // Find some documents
        //     collection.find({'a': 3}).toArray(function(err, docs) {
        //       assert.equal(err, null);
        //       console.log("Found the following records");
        //       console.log(docs);
        //       cb(docs);
        //     });
        // }
            // var likedQuery = await con.db.collection('matches').find({ them: req.body.hash })
    }
    
    // findUsers: async function findPotentialMatches(req, res) {
    //     userinterests = req.session.user.interests;
    //     usergender = req.session.user.gender;
    //     var queryObj = {verified: true};
    //       await Object.assign(queryObj, { $or: [{interests: usergender}, {interests: "both"}]});
    //     if (userinterests == "male" || userinterests == "female")
    //       await Object.assign(queryObj, {gender: userinterests});
    //     var X = await con.db.collection('user').find( queryObj ).project({_id: 0, city: 1, pp: 1, firstname: 1, lastname: 1, username: 1, hash: 1,
    //       gender: 1, age: 1, bio: 1, fame: 1, ip: 1, interests: 1}).toArray();
    //     // console.log("Before ret"+returnObj)
    //     return (X);
    // },

}