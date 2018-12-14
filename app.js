

var express = require('express');

var app = express();

var serv = require('http').Server(app);

var multer = require('multer');

var Database = require('./app/model/accountModel');

app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log("Server started.");

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

var io = require('socket.io')(serv, {});
module.exports = io;

// Use Api routes in the App
let apiRoutes = require(__dirname + "/app/routes/api-routes.js")

app.use('/api', apiRoutes)


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

	// File Upload
	app.post('/upload',multer(multerConf).single('photo'),function (req, res){
		if(req.file){
			console.log(req.file);
			req.body.photo = req.file.filename;
			req.body.path = req.file.path;
			Database.addPhotoProfile(req.body, function (cb) {
				//socket.emit('uploadFileResponse');
			});
		}
	});	

