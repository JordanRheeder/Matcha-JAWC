const express = require('express');
const multer = require("multer"); // multer is short for 'multipart/form-data' which is primarily used for uploading files. Also have a look at 'formidable'
const fs = require("fs");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const router = express.Router();
const uri = process.env.URI;

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

const upload = multer({storage});

router.get('/signOut', (req, res,) => {
    req.session.user = null;
    return res.redirect('/login')
    //admin
});

router.get('/profile/:keys', async (req, res, next) => {
    if (!req.session.user)
        res.redirect('/login');
    try {
        await db.collection('user').findOne({ username: req.params.keys }, {pp: 1, firstname: 1}, (e, filename0) => {
            if (e)
                throw e;
            gfs.files.find({ filename: filename0.pp }).toArray((err, files) => {
                if (!files || files.length === 0) {
                    console.log('no file found...\n');
                    res.render('admin/profile.ejs', {user: filename0.firstname, files: false, title: 'Profile'});
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
            console.log('Filename: \t' + ls.get('PP'));
            res.render('admin/profile.ejs', {user: filename0.firstname, filename: filename0.pp, files: files, title: 'Profile'});
            }
        })
        console.log(filename0);
    })
    } catch (e) {
        //
        //
        //
        //
        // need to redirect to 404 and say that no user is fo
        //
        //
        //
        res.redirect('/login');
    }
    //admin
});

router.get('/profile', async (req, res, next) => {
    if (!req.session.user)
        res.redirect('/login');
    res.redirect('/profile/' + req.session.user.username);
    //admin
});

router.get('/signOut', async (req, res,) => {
    req.session.user = null;
    return res.redirect('/')
    //admin
});
router.get('/UploadPP', function(req, res){
    if (!req.session.user)
        res.redirect('/login');
    return res.render('admin/UploadPP.ejs', {title: 'Upload'});
    //admin
});


router.post('/UploadPP', upload.single('file'), (req, res) => {
    res.redirect('/editprofile');
    //admin
});

router.post('/EditAccount', function (req, res) {
    var editAccount = require('./controllers/editAccount.js');
    // console.log("Req fname: " + req.body.firstname);
    // console.log("hash: " + req.session.user.hash);
	editAccount.editAccount(req, res);
    res.redirect('/editprofile');
    //admin
});

// render image to browser
router.get('/editprofile', (req, res) =>{
    if (!req.session.user)
        res.redirect('/login');
    const fname = ls.get('PP');
    console.log("fname: " + fname);
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
    //admin
});

router.get('/editsettings', function(req, res){
    if (!req.session.user)
        res.redirect('/login');
    res.render('admin/editSettings.ejs', {title: 'Profile', files: null});
    //admin
});

router.get('/files/:filename', (req, res) => {
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
    //admin
});

router.get('/image/:filename', (req, res) => {
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
    //admin
});

router.get('/chats/:keys', async (req,res) => {
    if (!req.session.user)
        res.redirect('/login');
    else if (!req.params.keys || req.params.keys == "")
        username = req.session.user.username;
    else
        username = req.params.keys;
    const getUserData = require('./controllers/profile');
    // console.log(req.params.keys);
    console.log(username);
    var userdata = await getUserData.getUserDetails(username);
    console.log(userdata);
    return res.render('chats/chat.ejs', {title: 'Chats', userdata: userdata});
    //admin
});

router.get('/matches', async function(req, res) {
    if (!req.session.user)
        res.redirect('/login');
    var matches = require('./controllers/matches.js');
    var userdata = await matches.findUsers(req, res);
    console.log(userdata);
    console.log(req.session.user);
    return res.render('matches/matches.ejs', {title: 'Matches', userdata: userdata});
    //admin
});

router.post('/matches', async function(req, res) {
    console.log("matches.post called");
    var matches = require('./controllers/matches');
    matches.matchUsers(req.body.hash, req.session.user.hash);
    return res.render('chats/chat.ejs', {title: 'Chats'});
    //admin
});

router.get('/chats', ( req, res ) => {
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
    //admin
});

router.post('/chats', (req, res) => {
    // pass this into socket(chat) controller
    if (!req.session.user)
        res.redirect('/login');
    var chat = require('./controllers/chat.js');
    chat.chat(req, res);
    //admin
});

module.exports = router;