if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Modules

const express = require("express"); // creates the app
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
const flash = require('express-flash');
const methodOverride = require('method-override');
const path = require('path');


// *****************

// Models for our DB
    require('./models/user');
//
let gfs;
var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
    return res.render('generic/index.ejs', {title: 'Matcha'});
}).listen(3000)

app.get('/register', function(req,res){
    res.render('auth/register.ejs', {title: 'Register'});
})

app.post('/register', async (req,res) => {
    var register = require('./controllers/register.js');
    register.register(req, res);
    res.render('auth/login.ejs', {title: 'Login'});
})

app.get('/account', (req, res, next) => {
    res.render('admin/account.ejs', {user: req.session.user.firstname, filename: req.session.filename, title: 'Account'});
})

app.get('/login', (req, res, next) => {
    res.render('auth/login.ejs', {title: 'Login'});
})

app.post('/login', async (req, res) => {
    var login = require('./controllers/login.js');
    login.login(req, res);
    // res.render('generic/index.ejs', {title: 'Matcha'});
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
                req.session.user.filename = filename;
                db.collection('user').findOneAndUpdate({
                    _id: req.session.user._id,
                    profilepicture: filename
                }, {$set: {profilepicture: filename}}, function (err, result) {

                    //Error handling
                    if (err) {
                       return res.status(500).send('Something broke!');
                    }
            
                   //Send response based on the required
                    if (result.hasOwnProperty("value") && 
                      result.value !== null) {
                         res.send(true);
                    } else {
                         res.send(false);
                    }
               });
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
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
    res.redirect('/EditAccount');
});

// render image to browser
app.get('/EditAccount', (req, res) =>{
    const fname = (req.session.user.filename);
    gfs.files.find({ filename: fname }).toArray((err, files) => {
        if (!files || files.length === 0) {
            res.render('admin/editAccount.ejs', {files: false, title: 'Account'});
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
            res.render('admin/editAccount.ejs', {files: files, title: 'Account'})
        }
    })
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