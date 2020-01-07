if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Modules
// 'use strict';

const express = require("express"); // creates the app
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
const getIP = require('external-ip')();
// var geoip = require('geoip-lite');
var ip2location = require('ip-to-location');


// *****************

// Models for our DB Can remo
  const user = require('./models/user');
//
let gfs;
const uri = "mongodb+srv://Admin:Epicrouter1@cluster0-fkcom.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('images');
    console.log("connection succeeded");
})
// var userSchema = mongoose.model('user');

const app = express();
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
app.use(express.static('public')); //Why?
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname));
app.use(express.static('public'));
app.use(flash());
// Middleware
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

//

// View engine

app.set('view-engine', 'ejs');
app.set('views', 'views');

//


app.get('/', (req, res) => {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.render('generic/index.ejs', { title: 'Matcha' });
}).listen(3000)

app.get('/register', function(req,res){
    res.render('auth/register.ejs', { title: 'Register', message: false });
})


app.all('/register', async function(req, res){
    var register = require('./controllers/register.js');
    await register.register(req, res);
    //res.render('auth/register.ejs', { title: 'Register', message: 'Account created, verify your account!' })
});

app.get('/login', (req, res, next) => {
    res.render('auth/login.ejs', {title: 'Login', message: false});
})

app.post('/login', async (req, res) => {
    var login = require('./controllers/login.js');
    await login.login(req, res);
    await getIP((err, ip) => {
        if (err) {
            // every service in the list has failed
            throw err;
        }
        // set local variable ip and upon login set ip??
        db.collection('user').findOneAndUpdate({ hash: req.session.user.hash }, {
            $set: { ip: ip } }); {
                if (err) throw(err);
            };
    });
    // const ip = ls.get('IP')
    // console.log(ip);
    // console.log(ip);
    let ip = await db.collection('user').findOne({hash: req.session.user.hash}, {ip: 1})
    console.log(ip.ip);
    ip2location.fetch(ip.ip, function(err, res){
        console.log(res);
    })
});

app.get('/signOut', async (req, res,) => {
    req.session.user = null;
    return res.redirect('/')
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
})

app.get('/reset/:key', async (req, res) => {
    console.log({key: req.params.key});
//     var resetUser = require('./controllers/resetUser.js');
//     resetUser.reset(req, res);
//     // Reset the valid account, force re-verification
    res.render('auth/reset.ejs', {title: 'Reset'})
})

app.get('/profile', async (req, res, next) => {
    const filename0 = await db.collection('user').findOne({ email: req.session.user.email }, {pp: 1})
    console.log(filename0);
    // console.log('Filename: \t' + ls.get('PP'));

    gfs.files.find({ filename: filename0.pp }).toArray((err, files) => {
        if (!files || files.length === 0) {
            console.log('no file found...\n');
            res.render('admin/profile.ejs', {user: req.session.user.firstname, files: false, title: 'Profile'});
        } else {
            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    console.log('true')
                    file.isImage = true;
                } else {
                    console.log('false')
                    file.isImage = false;
                }
                console.log('File exists')
            });
            // res.render('admin/editAccount.ejs', {files: files, title: 'Profile'})
            console.log('Filename: \t' + ls.get('PP'));
            res.render('admin/profile.ejs', {user: req.session.user.firstname, filename: filename0.pp, files: files, title: 'Profile'});
        }
    })
});

app.get('/login', (req, res, next) => {
    res.render('auth/login.ejs', {title: 'Login'});
})

app.post('/login', async (req, res) => {
	var login = require('./controllers/login.js');
	await login.login(req, res);
});

app.get('/forgotPassword', (req, res) => {
	res.render('auth/forgotPassword.ejs');
});

app.post('/forgotPassword', (req, res) => {
	
});

app.get('/signOut', async (req, res,) => {
    req.session.user = null;
    return res.redirect('/')
});

const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf)=> {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                };
                ls.set('PP', filename);
                db.collection('user').findOneAndUpdate({ hash: req.session.user.hash }, { $set: { pp: filename } }); {
                    if (err) throw(err);
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({storage})

app.get('/UploadPP', function(req, res){
    return res.render('admin/UploadPP.ejs', {title: 'Upload'});
});

app.post('/UploadPP', upload.single('file'), (req, res) => {
    res.redirect('/editprofile');
});

app.post('/EditAccount', function (req, res) {
    var editAccount = require('./controllers/editAccount.js');
    console.log("Req fname: " + req.body.firstname);
	editAccount.editAccount(req, res);
	res.redirect('/editprofile');
});

// render image to browser
app.get('/editprofile', (req, res) =>{
    const fname = ls.get('PP');
    try {gfs.files.find({ filename: fname }).toArray((err, files) => {
        if (!files || files.length === 0) {
            res.render('admin/editProfile.ejs', {files: false, title: 'Profile'});
        } else {
			files.map(file => {
				if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
					console.log('true')
                    file.isImage = true;
                } else {
					console.log('false')
                    file.isImage = false;
                }
                console.log('File exists')
            });
            res.render('admin/editProfile.ejs', {files: files, title: 'Profile'})
        }
    })
    } catch {
        res.render('admin/editProfile.ejs', {files: false, title: 'Profile'});
        console.log("Error editProfile - Line 248")
    }
});

app.get('/editsettings', function(req, res){
    res.render('admin/editSettings.ejs', {title: 'Profile', files: null});
});

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // If File exists this will get executed
      const readstream = gfs.createReadStream(file.filename);
      return readstream.pipe(res);
    });
  });

  app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if the input is a valid image or not
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // If the file exists then check whether it is an image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

app.get('/chats', (req,res) => {
    return res.render('chats/chat.ejs', {title: 'Chats'});
})

console.log("Started: Now listening on P-3000");
