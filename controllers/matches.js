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
        var X = await db.collection('user').find({}, {username : 1, email: 1}).toArray().then( result => {
          console.log(result)
        });
        return (result);
    }
}