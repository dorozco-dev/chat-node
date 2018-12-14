var Database = require('../model/accountModel');

var path = require('path');
var route = path.join(__dirname, '..');
var io = require(route);

exports.findAllUsers = function (req, res) {
	Database.findAllUsers(function (cb) {
		res.json(cb)
	});	
};

exports.findPhotoByIdAccount = function (req, res) {
	Database.findPhotoByIdAccount(req.params.id, function (cb) {
			res.json(cb)
    });
};



io.sockets.on('connection', function (socket) {

    socket.on('signIn', function (data) { 
        Database.isValidPassword(data, function (res) {
            if (!res.cb){
				return socket.emit('signInResponse', {success: false, message:"username or password invalid"});
			}else{
				return socket.emit('signInResponse', {success: true, message:"", data:res.data, sId: socket.id});
			}   
        });
		
    });
	
    socket.on('signUp', function (data) {
        Database.isUsernameTaken(data, function (res) {
            if (res) {
                socket.emit('signUpResponse', {success: false, message: "Username is taken"});
            } else {
                Database.addAccount(data, function () {});
				socket.emit('signUpResponse', {success: true, message: "Your User was created"});
            }
        });
    });
});