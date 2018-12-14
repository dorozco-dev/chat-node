var Database = require('../model/chatModel');

var path = require('path');
var route = path.join(__dirname, '..');
var io = require(route);

exports.findChatMessageByChatId = function (req, res) {
	Database.findChatMessageByChatId(req.params.id, function (cb) {
		res.json(cb)
	});	
};

var SOCKET_LIST = {};

io.sockets.on('connection', function (socket) {
	
	console.log(socket.id);
	
	socket.on('createChat', function (data) {
		Database.addChat(data, function (res) {
            socket.emit('chatResponse', res);
        });
	});
	
	socket.on('sendMessage', function (data) {
		Database.addChatMessage(data, function (res) {
			io.emit('chatMessageResponse', {data: res});
        });
	});

});