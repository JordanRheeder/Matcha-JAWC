const mongoose = require('mongoose');

var uri = process.env.URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
var db=mongoose.connection;

async function setupDatabase() {
    await db.createCollection("user", function(err, db) {
        if (err)
            throw (err)
        else
            console.log("User collection created!");
            db.close();
    });
    await db.createCollection("matches", function(err, db) {
        if (err)
            throw (err)
        else
            console.log("Matcha collection created!");
            db.close();
    });
}

setupDatabase();

//need function to insert dummy data into mongodb