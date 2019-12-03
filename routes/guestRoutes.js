const express = require('express');

const app = express.Router();

// some things
// 
// const guestController = require('../controllers/guest');
// const isAuth = require('../middleware/is-auth');
//

app.get('/', (req, res, next) =>{
    res.render('admin/account.ejs');
}); //index

module.exports = app;
