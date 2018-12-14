var Database = require('../model/groupChatModel');

var path = require('path');
var route = path.join(__dirname, '..');
var io = require(route);

exports.findGroupChatByAccountId = function (req, res) {
	Database.findGroupChatByAccountId(req.params.id, function (cb) {
		res.json(cb)
    });
};
exports.findUsersByGroupId = function (req, res) {
	Database.findUsersByGroupId(req.params.id, function (cb) {
		res.json(cb)
    });
};

exports.findGroupChatMessagesById = function (req, res) {
	Database.findGroupChatMessagesById(req.params.id, function (cb) {
		res.json(cb)
    });
};

io.sockets.on('connection', function (socket) {
	
	socket.on('createGroupChat', function (data) {
		Database.addGroupChat(data, function (res) {});
		socket.emit('createGroupChatResponse', {message: "You create a group"});
	});
	
	socket.on('addUserToGroup', function (data) {
		
		for(var i = 0; i < data.length; i ++){
			console.log(data[i])
			Database.AddUserToGroup(data[i], function (res) {
				console.log(res)
				socket.broadcast.emit('addUserToGroupResponse',{message:"You Were Added to a Group", data: res});
			});
		}
	});
	
	socket.on('sendGroupMessage', function (data) {
		Database.addGroupMessage(data, function (res) {
            io.emit('sendGroupMessageResponse', {data: res});
        });
	});
	
});