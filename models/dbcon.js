const uri = process.env.URI;
const monk = require('monk')
const dbcon = monk(process.env.emailUser + ':' + process.env.emailUser + '@cluster0-fkcom.mongodb.net/matcha?retryWrites=true&w=majority');
const mongoose = require('mongoose');

// var db = monk('USERNAME:PASSWORD@localhost:27017/nodetest1');

mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
var db=mongoose.connection;

dbcon.on('timeout', () => {
  console.log('Mongo connection lost')
})

dbcon.on('close', () => {
  console.log('Mongo connection closed')
})

dbcon.on('reconnect', () => {
  console.log('Mongo reconnected')
})

// dbcon.db.on('timeout', () => {
//   console.log('Mongo connection lost')
// })

// dbcon.db.on('close', () => {
//   console.log('Mongo connection closed')
// })

// dbcon.db.on('reconnect', () => {
//   console.log('Mongo reconnected')
// })

module.exports = db;