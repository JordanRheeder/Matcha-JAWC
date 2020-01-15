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
        var X = await db.collection('user').find({ verified: true }).project({_id: 0, city: 1, pp: 1, firstname: 1, lastname: 1, username: 1, gender: 1, age: 1, bio: 1, fame: 1}).toArray();
          console.log(X);
        return (X);
    }
}