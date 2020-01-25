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
        io.on('connection', (socket) => {

            console.log('made socket connection', socket.id);
        
            // Handle chat event
            io.on('chat', function(data){
                console.log(data.message);
                io.socket.emit('chat', data);
                console.log('received');
                io.sockets.emit('chat', data);
            });
            // Handle typing event
            socket.on('typing', function(data){
                socket.broadcast.emit('typing', data);
            });
        });
        
        io.on('chat', function(data){
            console.log(data.message);
            io.sockets.emit('chat', data);
        });
    }
};
