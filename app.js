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
// *****************

// Models for our DB
    //require('./models/user');
//

const app = express();
app.use(session({
    secret: 'MatchyMatcha',
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
    email => db.collection('User').findOne({ email: email })
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
    return res.render('generic/index.ejs');
}).listen(3000)

app.get('/register', function(req,res){
    res.render('auth/register.ejs');
})

app.post('/register', async (req,res) => {
    // 
//  This needs to be changed to work with SQL
    // 
    // try {
    //     const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //     // Grabbing the inputs form data 
    //     var data = new userSchema({
    //         firstname: req.body.fname,
    //         lastname: req.body.sname,
    //         email: req.body.email,
    //         username: req.body.username,
    //         password: hashedPassword,
    //         hash: Date.now() + Math.random().toString(16).slice(2, 14),
    //         sexuality: req.body.sexuality,
    //     })
    //     exist = false;
    //     if (!exist) {

    //     }
    //         db.collection('User').insertOne(data,function(err, collection){
    //             if (err) throw err;
    //             console.log("Record insterted successfully");
    //         });
    // } catch {
    //     res.redirect('/register');
    // }
    // console.log(data);
    // res.redirect('/login');
})

app.get('/account', (req, res, next) => {
    res.render('admin/account.ejs');
})

app.get('/login', (req, res, next) => {
    res.render('auth/login.ejs');
})

app.post('/login', async (req, res) => {
// 
// This also needs to be changed and work with SQL
// 
    // const email= req.body.email;
    // const password = req.body.password;
    // console.log({email, password});
    // if (!email || !password) {
    //     res.status(400).json({ message: 'No data provided' });
    // } else {
    //     const user = await db.collection('User').findOne({ email: email });
    //     console.log(user);
    //     if (!user) {
    //         return res.status(404).json({ message: 'User not found' });
    //     }
    //     try {
    //         isMatch = await bcrypt.compare(password, user.password);
    //         if (isMatch) {
    //             req.session.user = user;
    //             return res.redirect('/')
    //         } else {
    //             // need to add a proper error message ... that is rendered on the page.
    //             return res.status(400).json({ password: 'password incorrect' });
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ error, message: 'Something went wrong' });
    //     }
    // }
});

app.get('/signOut', async (req, res,) => {
    req.session.user = null;
    return res.redirect('/')
});

app.get('/UploadPP', function(req, res){
    return res.render('admin/UploadPP.ejs');
});

// app.post('/UploadPP', upload.single('file'), (req, res) => {
//     res.redirect('/EditAccount');
// });

app.get('/chats', (req,res) => {
    return res.render('chats/chat.ejs');
})

console.log("Started: Now listening on P-3000");