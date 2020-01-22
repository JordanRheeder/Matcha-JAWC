// Make our connection
var socket = io.connect('http://localhost:3000');
var message = document.getElementById('message')
var btn = document.getElementById('send')
var output = document.getElementById('output')

// Emit events
console.log(message);
if (message){
    console.log(message)
}
if (btn) {
    btn.addEventListener('click', function(){
        socket.emit('chat', {
            message: message.value
        });
        message.value = '';
    });
};
if (message) {
        message.addEventListener('keypress', function(){
        socket.emit('typing');
    })
}
$(function(){
    // when the client clicks SEND
    $('#send').click( function() {
        var message = $('#message').val();
        $('#message').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });
});

// Listen for events
socket.on('chatUpdate', function(data){
    $('#conversation').append('<b>' + '</b> ' + data + '<br>');
    // $('#output').append('<b>' + ':</b> ' + data + '<br>');
	});

// socket.on('typing', function(data){
//     feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
// });