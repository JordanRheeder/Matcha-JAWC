const uri = process.env.URI;
const monk = require('monk')
const dbcon = monk(process.env.EMAILUSER + ':' + process.env.EMAILPASS + '@cluster0-fkcom.mongodb.net/matcha?retryWrites=true&w=majority');
const mongoose = require('mongoose');

mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

var db=mongoose.connection;

dbcon.on('timeout', () => {
  console.log('Mongo connection lost')
});

dbcon.on('close', () => {
  console.log('Mongo connection closed')
});

dbcon.on('reconnect', () => {
  console.log('Mongo reconnected')
});

module.exports = db;