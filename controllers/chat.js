const io = require('./../app.js');
const mongoose = require('mongoose');
var uri = 'mongodb+srv://Jordan:Epicrouter1@cluster0-fkcom.mongodb.net/chat?retryWrites=true&w=majority';
// var events = require('./../views/static/eventManager.js');
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 

var db=mongoose.connection;

module.exports = {
	chat: function chatUser(req, res) {
        io.sockets.on('connection', function (socket) {
            // when the client emits 'sendchat', this listens and executes
            // console.log(socket.data);
            socket.on('sendchat', function (data) {
                // we tell the client to execute 'updatechat' with 2 parameters
                io.sockets.emit('updatechat', data);
                console.log(data + "\tSent from client to server");
            })
        });
    }
};
