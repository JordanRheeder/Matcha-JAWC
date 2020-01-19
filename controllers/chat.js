const io = require('./../app.js'); // requiring the io module where io binds to http server. 
const db = require('./../app.js'); // requiring the connection to the database. 
const mongoose = require('mongoose');
var uriUser = 'mongodb+srv://Jordan:Epicrouter1@cluster0-fkcom.mongodb.net/user?retryWrites=true&w=majority'; // user uri to extract username, etc.
var uriChat = 'mongodb+srv://Jordan:Epicrouter1@cluster0-fkcom.mongodb.net/chat?retryWrites=true&w=majority'; // chat uri to store texts.
// var events = require('./../views/static/eventManager.js');
mongoose.connect(uriUser, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 

var dbUser=mongoose.connection;

module.exports = {
	chat: function chatUser(req, res) {
        io.sockets.on('connection', function (socket) {
            // when the client emits 'sendchat', this listens and executes
            // console.log(socket.data);
            var firstName = dbUser.collection('user').findOne({ firstname: firstName });
            console.log(firstName);
            
            socket.on('sendchat', function (firstName, data) {
                // we tell the client to execute 'updatechat' with 2 parameters
                io.sockets.emit('updatechat', firstName, data);
                console.log(data + "\t" + firstName + "\tSent from client to server");
            })
        });
    }
};
