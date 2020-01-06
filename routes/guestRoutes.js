const express = require('express');

const app = express.Router();

app.get('/', (req, res, next) =>{
    res.render('admin/profile.ejs');
}); //index

module.exports = app;
