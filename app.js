if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Modules
// 'use strict';

// const express = require("express"); // creates the app
    // mailer = require('express-mailer');
// const flash = require("express-flash"); // define a flash message and render it without redirecting the request.
const session = require("express-session"); // self-explanatory
const bodyParser = require("body-parser"); // https://www.npmjs.com/package/body-parser (This is where you get form data from the browser by using the 'req.body' property)
const multer = require("multer"); // multer is short for 'multipart/form-data' which is primarily used for uploading files. Also have a look at 'formidable'
// Not sure which is better
const crypto = require("crypto");
const bcrypt = require("bcrypt"); // using bcrypt because it can generate us a hash which we can use to create our user tokens and apply it to the sql database.
//
const passport = require("passport"); // Allows for different login/out strategies http://www.passportjs.org/
const fs = require("fs");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
var sessionStorage = require('sessionstorage');
const ls = require('local-storage');
const nodemailer = require('nodemailer')
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var express = require('express')
var app = express();
var server = app.listen(3000, function(){
    console.log('listening for requests on port 3000,');
});
var socket = require('socket.io');
var io = socket(server);

// *****************

// Models for our DB Can remo
// const user = require('./models/user');
//
let gfs;

const db = require('./models/dbcon');

// var userSchema = mongoose.model('user');

db.collection('matches').find({});
db.collection('user').find({});

app.use(methodOverride('_method'));
var secretKey = process.env.SESSION_SECRET;
app.use(session({
    cookie: { maxAge: 3600000 },
    secret: secretKey,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(express.static(__dirname)); 
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
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

app.get('/', (req, res) => {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.render('generic/index.ejs', { title: 'Matcha' });
});

app.get('/register', function(req,res){
    res.render('auth/register.ejs', { title: 'Register', message: false });
})


app.all('/register', async function(req, res){
    var register = require('./controllers/register.js');
    await register.register(req, res);
});

app.get('/login', (req, res, next) => {
    res.render('auth/login.ejs', {title: 'Login', message: false});
})

app.post('/login', async (req, res) => {
    var login = require('./controllers/login.js');
    await login.login(req, res);
    ls.set('FN', req.session.user.firstname);
});

app.get('/verify/:key', async (req, res) => {
    console.log({key: req.params.key});
    var verifyUser = require('./controllers/verifyUser.js');
    verifyUser.verify(req, res);
    res.render('auth/verify.ejs', {title: 'Verification'});
})

app.get('/forgotPass', (req, res) => {
    console.log('GET:forgotpass ==> rendering now\n\t')
    res.render('auth/forgot.ejs', {title: 'Reset'});
})

app.post('/forgotPass', (req, res) => {
    var resetUser = require('./controllers/resetSend.js');
    resetUser.resetUser(req, res);
});

app.get('/reset/:key', async (req, res) => {
    console.log({key: req.params.key});
    res.render('auth/reset.ejs', {title: 'Reset'});
});

app.get('/login', (req, res, next) => {
    res.render('auth/login.ejs', {title: 'Login'});
});

app.post('/login', async (req, res) => {
	var login = require('./controllers/login.js');
    await login.login(req, res);
    // ls.set('FN', req.session.user.firstname);
});

app.get('/forgotPassword', (req, res) => {
	res.render('auth/forgotPassword.ejs');
});

app.get('/signOut', async (req, res,) => {
    req.session.user = null;
    req.session.destroy;
    return res.redirect('/login')
});

app.post('/EditAccount', function (req, res) {
    var editAccount = require('./controllers/editAccount.js');
	editAccount.editAccount(req, res);
	res.redirect('/editprofile');
});

app.get('/editsettings', function(req, res){
    if (!req.session.user)
        res.redirect('/login');
    res.render('admin/editSettings.ejs', {title: 'Profile', files: null});
});

// render image to browser
app.get('/editprofile', (req, res) =>{
    if (!req.session.user)
        res.redirect('/login');
    res.render('admin/editProfile.ejs', {files: false, title: 'Profile'});
});

app.get('/profile/:keys', async (req, res, next) => {
    if (!req.session.user)
    res.redirect('/login');
    else {
        const getUserData = require("./controllers/profile");
        // var userData = getUserData.getUserdata(req.params.keys);
        var userData = await getUserData.getUserDetails(req.params.keys); 
        // console.log(userData.profilePicture);
        res.render('admin/profile.ejs', {title: 'Profile', user: userData});
    }
});


app.get('/profile', async (req, res, next) => {
    if (!req.session.user)
        res.redirect('/login');
    else
        res.redirect('/profile/' + req.session.user.username);
});

app.post('/uploadProfilePicture', async (req, res) => {
    if (!req.session.user)
        res.redirect('/login');
    const storeProfilePicture = require('./controllers/profile.js');
    await storeProfilePicture.storeUserProfilePictures(req, res, 1);
    // res.redirect('/profile');
});

app.get('/chats/:keys', async (req,res) => {
    if (!req.session.user)
        res.redirect('/login');
    else if (!req.params.keys || req.params.keys == "")
        username = req.session.user.username;
    else
        username = req.params.keys;
    const getUserData = require('./controllers/profile');
    // console.log(req.params.keys);
    // console.log(username);
    var userData = await getUserData.getUserDetails(username);
    // console.log(userdata);
    // console.log(userdata);
    return res.render('chats/chat.ejs', {title: 'Chats', user: userData});
});

// app.get('/generateRoomName', ( req, res) => {
//     var roomName = require('./controllers/roomName.js');
//     roomName.roomName(req, res);
// });
// room connector, read from array stored from mongodb.

app.get('/chats', ( req, res ) => {
    if (!req.session.user)
        res.redirect('/login');
    // var key = req.params.key;
    // console.log('1')
    // var firstname = req.session.user.firstname;
    // console.log(firstname)
    // var roomName = require('./controllers/roomName.js');
    // roomName.generateName(req, res);
    // console.log('roomName called');
    res.redirect('/chats/' + req.session.user.username);
});

app.post('/chats', (req, res) => {
    // pass this into socket(chat) controller
    if (!req.session.user)
        res.redirect('/login');
    var chat = require('./controllers/chat.js');
    chat.chat(req, res);
});

app.get('/matches', async function(req, res) {
    if (!req.session.user)
        res.redirect('/login');
    var matches = require('./controllers/matches.js');
    var tracer = require('./controllers/location.js');
    var userdata = await matches.findUsers(req, res);
    var location = await tracer.IPLocation(req,res,userdata);
    console.log('app.js' + JSON.stringify(location));
    return res.render('matches/matches.ejs', {title: 'Matches', userdata: location});
});

app.post('/matches', async function(req, res) {
    console.log("matches.post called");
    var matches = require('./controllers/matches');
    matches.matchUsers(req.body.hash, req.session.user.hash);
    res.redirect('/chats');
});