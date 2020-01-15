$(function(){
    // buttons and inputs for messaging.
    var chatFrom = $("#chatFrom");
    var chatTo = $("#chatTo");
    var sendMessage = $("#sendMessage");
    var message = $("#message");
	var chatroom = $("#chatroom");
	var chatRoomName = $("#sendChatId");

    // buttons and inputs for handling the morphing socket ids
    var user = $("#is_user");
    var login = $("#login");
    var email = $("#email");
    var like = $("#like");
    var liker = $("#liker");
    var potmatch = $("#potmatch");
    // buttons and inputs for the notifications
    var notifblock = $("#notifblock");
    var view = $("#profile_view");
    var viewed = $("#profile_viewed");
    // make connection.
    var socket = io.connect();
    socket.on('connect', () => update());
    function update() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
    }

    // Emit a new message
    sendMessage.click(function() {
        // this sends the new client id, will change it to do that on reload of any page
        // var str = (window.location).toString();
        // socket.emit('update', {user: user.val(), id: socket.id, page: str});
        console.log('new message emit');
        socket.emit('newMessage', {message: message.val()});
    });

    // create a tracker for a user on login
    login.click(function() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
        socket.emit('login_notif', {user: user.val()});
        socket.emit('login', {email: email.val()});
    })
    // Listen for a new message
    socket.on('new_message', (data) => {
		if (data.chatID.includes(data.username) && chatRoomName.val() === data.chatID)
			chatroom.append("<p style='color: white'>" + data.username + ": " +  data.message + "</p>");
    });

    // Send notif info on a like click to server
    like.click(function() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
        socket.emit('new_like', {liked: potmatch.val(), liker: liker.val()});
    }) 

    // Listen for a new notif
    socket.on('new_notification', (data) => {
        notifblock.append("<div class='alert alert-danger alert-dismissible fade show' role='alert'>"
            + data.message + " " + data.user +
            "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>"
            + "</div>");
    });
    // listen for a new message notif.
    socket.on('message_notification', (data) => {
        var str = (window.location).toString();
        if (!str.includes(data.chatID)) {
            if (data.message.length > 30) {
                notifblock.append("<div class='alert alert-danger alert-dismissible fade show' role='alert'>"
                + data.username + ": " + data.message.substring(0, 30) + "..." +
                "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>"
                + "</div>");
            } else {
                notifblock.append("<div class='alert alert-danger alert-dismissible fade show' role='alert'>"
                + data.username + ": " + data.message +
                "<button type='button' class='close' data-dismiss='alert' aria-label='close'><span aria=hidden='true'>&times;</span></span></button>"
                + "</div>");
            }
        };
    });
    // send to server on profile getting viewed
    view.click(function() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
        socket.emit('new_view', {viewer: user.val(), viewed: viewed.val()});
    })
});