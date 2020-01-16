$(function(){
    // buttons and inputs for messaging.
    // var chatFrom = $("#chatFrom");
    // var chatTo = $("#chatTo");
    var sendMessage = $("#sendMessage");
    var message = $("#message");
	// var chatroom = $("#chatroom");
	// var chatRoomName = $("#sendChatId");

    // buttons and inputs for handling the morphing socket ids
    // var user = $("#is_user");
    // var login = $("#login");
    // var email = $("#email");
    // var like = $("#like");
    // var liker = $("#liker");
    // var potmatch = $("#potmatch");
    // buttons and inputs for the notifications
    // var notifblock = $("#notifblock");
    // var view = $("#profile_view");
    // var viewed = $("#profile_viewed");
    // make connection.
	var io = require('./../../app.js');

	io.sockets.on('connection', function (socket) {

		// when the client emits 'sendchat', this listens and executes
		socket.on('sendchat', function (data) {
			// we tell the client to execute 'updatechat' with 2 parameters
			io.sockets.emit('updatechat', data);
			console.log(data + "\tSent from client to server");
		})
	});
});