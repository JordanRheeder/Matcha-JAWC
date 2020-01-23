const mongoose = require('mongoose');

const uri = process.env.URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
var db=mongoose.connection;

module.exports = db;