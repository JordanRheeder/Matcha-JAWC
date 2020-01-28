const io = require('./../app.js'); // requiring the io module where io binds to http server. 
const db = require('./../app.js'); // requiring the connection to the database. 
const mongoose = require('mongoose');
var uriUser = 'mongodb+srv://Jordan:Epicrouter1@cluster0-fkcom.mongodb.net/user?retryWrites=true&w=majority'; // user uri to extract username, etc.
var uriChat = 'mongodb+srv://Jordan:Epicrouter1@cluster0-fkcom.mongodb.net/chat?retryWrites=true&w=majority'; // chat uri to store texts.
const con = require('../models/dbcon');

// var events = require('./../views/static/eventManager.js');
// mongoose.connect(uriUser, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }); 

// var dbUser=mongoose.connection;

module.exports = {
    generateName: async function generateName(req, res) {
        console.log('here');
        // io.sockets.on('connection', function () {
            // console.log('here2')
            // when the client emits 'sendchat', this listens and executes
            // console.log(socket.data);
            // io.sockets.on('create'), function(room) {
                // socket.join(room);
                // console.log(room);
            // }
        try {
            var firstName = await con.db.collection('user').findOne({ firstname: req.session.user.firstname });
            console.log(firstName.firstname + 'test');
        } catch (error) {
            console.log(error)
            // return res.render('auth/login.ejs', { title: 'Login', message: 'Something went wrong, try again...' });
            return res.render('/chats', {title: 'Chat'});
        }
        // });
    }
};