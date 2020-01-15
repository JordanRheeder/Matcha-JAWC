const io = require('./../app.js');
const mongoose = require('mongoose');
var uri = 'mongodb+srv://Jordan:Epicrouter1@cluster0-fkcom.mongodb.net/chat?retryWrites=true&w=majority';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 

var db=mongoose.connection;

module.exports = {
	chat: function chatUser(req, res) {
        var message = req.body.message;
        console.log(message + '1');
        if (message) {
            console.log('true');
            io.on('newMessage', function (data) {
                // show the message
                console.log(data + '2');
                console.log(data.message + '3')
                console.log(message + '4');
                // client.sockets.emit('new_message', {message: data.message, username: socket.username});
            });
        }
}};
