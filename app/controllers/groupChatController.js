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
		Database.addGroupChat(data, function () {});
		 io.emit('createGroupChatResponse');
	});
	
	socket.on('addUserToGroup', function (data) {
		Database.AddUserToGroup(data, function () {});
		socket.emit('addUserToGroupResponse',{message:"Users Added To Group", data: {}});
	});
	
	socket.on('sendGroupMessage', function (data) {
		Database.addGroupMessage(data, function (res) {
            io.emit('sendGroupMessageResponse', {data: res});
        });
	});
	
});