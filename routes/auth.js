const express = require('express');

const router = express.Router();

router.post('/login', async (req, res) => {
    var login = require('./controllers/login.js');
    await login.login(req, res);
    //auth
});

router.post('/register', async function(req, res){
    var register = require('../controllers/register.js');
    await register.register(req, res);
});

router.post('/login', async (req, res) => {
    var login = require('../controllers/login.js');
    await login.login(req, res);
});

router.post('/forgotPass', async (req, res) => {
    var resetUser = require('../controllers/resetSend.js');
    resetUser.resetUser(req, res);
});

router.get('/verify/:key', async (req, res) => {
    console.log({key: req.params.key});
    var verifyUser = require('./controllers/verifyUser.js');
    verifyUser.verify(req, res);
    res.render('auth/verify.ejs', {title: 'Verification'});
    //auth
});

router.get('/login', (req, res, next) => {
    res.render('auth/login.ejs', {title: 'Login', user: res.locals.user, message: false});
    //auth
});

router.get('/register', function(req, res){
    res.render('../views/auth/register.ejs', { title: 'Register', message: false, user: res.locals.user  });
});

router.get('/login', (req, res, next) => {
    console.log(res.locals.user);
    res.render('../views/auth/login.ejs', {title: 'Login', message: false, user: res.locals.user });
});

router.get('/forgotPassword', (req, res) => {
    res.render('auth/forgotPassword.ejs', { user: res.locals.user, message: false });
});

router.get('/reset/:key', async (req, res) => {
//     console.log({key: req.params.key});
    res.render('auth/reset.ejs', { title: 'Reset', user: res.locals.user, message: false });
});


module.exports = router;
