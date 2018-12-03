require('./Database');
var express = require('express');
var app = express();
var serv = require('http').Server(app);

var multer = require('multer');

var multerConf = {
	storage : multer.diskStorage({
		destination : function (req, file, next){
			next(null,'C:/chat_images');
		},
		filename: function (req,file,next){
			var ext = file.mimetype.split('/')[1];
			next(null,file.fieldname + '-' + Date.now() + '.'+ ext);
		}
	}),
	fileFilter: function (req, file, next){
		if(!file){
			next();
		}
		const image = file.mimetype.startsWith('image/');
		if(image){
			next(null,true);
		}else{
			next({message:"File type not supported"},false);
		}
	}
}



app.get("/findProfilePhoto/:id",(req,res,next) => {
		console.log(req.params.id)
		Database.findPhotoByIdAccount(req.params.id, function (cb) {
			res.json(cb)
        });
	});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");

var SOCKET_LIST = {};
var DEBUG = true;
//SOCKET FUNCTIONS

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();

    socket.on('signIn', function (data) { //USERNAME PASSWORD
        if (data.username === "" || data.username === null || data.username === undefined) {
            socket.emit('signInResponse', {success: false,message:"username or password invalid"});
            return;
        }

        if (data.password === "" || data.password === null || data.password === undefined) {
            socket.emit('signInResponse', {success: false,message:"username or password invalid"});
            return;
        }

        Database.isValidPassword(data, function (res) {
            if (!res.cb){
				return socket.emit('signInResponse', {success: false, message:"username or password invalid"});
			}else{
				//Player.onConnect(socket, data.username);
				//SOCKET_LIST[res.data._id] = res.data;
				return socket.emit('signInResponse', {success: true,message:"",data:res.data});
			}   
        });
    });
	
    socket.on('signUp', function (data) {
        if (data.username === "" || data.username === null || data.username === undefined) {
            socket.emit('signUpResponse', {success: false});
            return;
        }

        if (data.password === "" || data.password === null || data.password === undefined) {
            socket.emit('signUpResponse', {success: false});
            return;
        }

        Database.isUsernameTaken(data, function (res) {
            if (res) {
                socket.emit('signUpResponse', {success: false, message: "Username is taken"});
            } else {
                Database.addUser(data, function () {
                    socket.emit('signUpResponse', {success: true, message: "Your User was created"});
                });
            }
        });
    });
	
	socket.on('createChat', function (data) {
		Database.addChat(data, function (res) {
            socket.emit('chatResponse', res);
        });
	});
	
	socket.on('sendMessage', function (data) {
		Database.addChatMessage(data, function (res) {
            socket.broadcast.emit('chatMessageResponse', {data: res});
        });
	});
	
	app.get("/findAllUsers",(req,res,next) => {
		Database.findAllUsers(function (cb) {
			res.json(cb)
        });
	});
	
	app.get("/findChatMessages/:id",(req,res,next) => {
		Database.findChatMessageByChatId(req.params.id, function (cb) {
			res.json(cb)
        });
	});
	

	
	
	
	//Group chat Method 
	
	socket.on('createGroupChat', function (data) {
		Database.addGroupChat(data, function () {});
		 socket.broadcast.emit('createGroupChatResponse');
	});
	
	app.get("/findGroupChatByAccountId/:id",(req,res,next) => {
		Database.findGroupChatByAccountId(req.params.id, function (cb) {
			res.json(cb)
        });
	});
	
	app.get("/findUsersByGroupId/:id",(req,res,next) => {
		console.log(req.params.id)
		Database.findUsersByGroupId(req.params.id, function (cb) {
			res.json(cb)
        });
	});
	
	socket.on('addUserToGroup', function (data) {
		Database.AddUserToGroup(data, function () {});
		socket.emit('addUserToGroupResponse',{message:"Users Added To Group", data: {}});
	});
	
	app.get("/findGroupChatMessages/:id",(req,res,next) => {
		Database.findGroupChatMessagesById(req.params.id, function (cb) {
			res.json(cb)
        });
	});
	
	socket.on('sendGroupMessage', function (data) {
		Database.addGroupMessage(data, function (res) {
            socket.broadcast.emit('sendGroupMessageResponse', {data: res});
        });
	});
	
	
	// File Upload
	app.post('/upload',multer(multerConf).single('photo'),function (req, res){
	
		if(req.file){
			console.log(req.file);
			req.body.photo = req.file.filename;
			req.body.path = req.file.path;
			Database.addPhotoProfile(req.body, function (cb) {
				socket.broadcast.emit('uploadFileResponse');
			});
		}
	});	

    socket.on('evalServer', function (data) {
        if (!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer', res);
    });
});









