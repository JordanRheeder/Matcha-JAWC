// const express = require("express"); // creates the app
// mailer = require('express-mailer');
// const flash = require("express-flash"); // define a flash message and render it without redirecting the request.
const session = require("express-session"); // self-explanatory
const bodyParser = require("body-parser"); // https://www.npmjs.com/package/body-parser (This is where you get form data from the browser by using the 'req.body' property)
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // using bcrypt because it can generate us a hash which we can use to create our user tokens and apply it to the sql database.
const passport = require("passport"); // Allows for different login/out strategies http://www.passportjs.org/
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
var sessionStorage = require('sessionstorage');
const ls = require('local-storage');
const nodemailer = require('nodemailer')
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
const fs = require("fs");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Modules
// 'use strict';

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
server.listen(3000);
module.exports = io;

const adminRoutes = require('./routes/admin');
const guestRoutes = require('./routes/guest');
const authRoutes = require('./routes/auth');

app.use('/admin', adminRoutes);
app.use(guestRoutes);
app.use(authRoutes);

// *****************

// Models for our DB Can remo
// const user = require('./models/user');
//
let gfs;
const uri = process.env.URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
var db=mongoose.connection;
module.exports = db;

db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('images');
    console.log("connection succeeded");
})
// var userSchema = mongoose.model('user');

// Find better work around
db.collection('matches').find({});
db.collection('user').find({});

app.use(methodOverride('_method'));
var secretKey = process.env.SESSION_SECRET;
app.use(session({
    cookie: { maxAge: 60000 },
    secret: secretKey,
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});

var initializePassport = require('./config/passport.js');
initializePassport(
    passport,
    email => db.collection('user').findOne({ email: email })
)

// View engine

app.set('view-engine', 'ejs');
app.set('views', 'views');




// app.get('/forgotPass', (req, res) => {
//     console.log('GET:forgotpass ==> rendering now\n\t')
//     res.render('auth/forgot.ejs', {title: 'Reset'});
//     //guest
// })




// app.get('/generateRoomName', ( req, res) => {
//     var roomName = require('./controllers/roomName.js');
//     roomName.roomName(req, res);

// });

// room connector, read from array stored from mongodb.

// key is going to be the room name we will be joining. Could possibly change
// app.get('/chats:key', (req,res) => {
//     return res.render('chats/chat.ejs', {title: 'Chats'});
// });

console.log("Started: Now listening on P-3000");
