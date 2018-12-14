var dbConst = require('../database/Database');

var mongojs = dbConst.USE_DB ? require("mongojs") : null;
var db = dbConst.USE_DB ? mongojs(dbConst.url, ['chat','chat_message']) : null;

Database = {};

exports.addChat = function(data,cb){
	if(!dbConst.USE_DB)
		return cb();
	
	db.chat.findOne({usernameOne:data.usernameOne, usernameTwo:data.usernameTwo},function(err,res){
		console.log("chat registered");
		if(res)
			return cb(res)
		else
		db.chat.findOne({usernameOne:data.usernameTwo, usernameTwo:data.usernameOne},function(err,res){
			console.log("chat registered");
			if(res)
				return cb(res)
			else
				console.log("insert");
				cb(insertChat(data));
		});
	});
}	

function insertChat(data){
	db.chat.insert({	
		usernameOne:data.usernameOne,
		usernameTwo:data.usernameTwo,
		time:data.time},function(err, response){
		return response;
	});
}

exports.addChatMessage = function(data,cb){
	if(!dbConst.USE_DB)
		return cb();
	db.chat_message.insert(
		{	
		objectIdChat:data.objectIdChat,
		objectIdAccount:data.objectIdAccount,
		username:data.username,
		usernameReceiver:data.usernameReceiver,
		message:data.message,
		time:Date()
		},function(err,response){
		 return cb(response)
	});
}	

exports.findChatMessageByChatId = function(data,cb){
	db.chat_message.find({objectIdChat: data}, function(err, res) {
		return cb(res);
	});
}