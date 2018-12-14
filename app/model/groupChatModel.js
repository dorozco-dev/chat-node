var dbConst = require('../database/Database');

var mongojs = dbConst.USE_DB ? require("mongojs") : null;
var db = dbConst.USE_DB ? mongojs(dbConst.url, ['group','group_account','group_message']) : null;

Database = {};

exports.addGroupChat = function(data,cb){
	if(!dbConst.USE_DB)
		return cb();
	
	insertGroupChat(data)
}

function insertGroupChat(data){
	db.group.insert({groupName:data.groupName,time:Date()},function(err, response){
		db.group_account.insert({groupId: response._id.toString(),
		groupName:data.groupName,accountId: data.accountId,
		username: data.username},function(err,response){});		
	});
}

exports.AddUserToGroup = function (data){
	
	for(var i = 0; i < data.length; i ++){
		value = data[i];
		if(value.checked){
			db.group_account.insert({groupId: value.groupId.toString(),
			groupName:value.groupName,
			username:value.username,
			accountId: value._id},function(err,response){});	
		}

	}						
}

exports.addGroupMessage = function(data,cb){
	if(!dbConst.USE_DB)
		return cb();
	db.group_message.insert(
		{	
		objectIdGroup:data.objectIdGroup,
		objectIdAccount:data.objectIdAccount,
		username:data.username,
		message:data.message,
		time:Date()
		},function(err,response){
		 return cb(response)
	});
}	

exports.findGroupChatByAccountId = function(data,cb){
	db.group_account.find({accountId: data}, function(err, res) {
		return cb(res);
	});
}

exports.findUsersByGroupId = function(data,cb){
	db.group_account.find({groupId: data}, function(err, res) {
		return cb(res);
	});
}

exports.findGroupChatMessagesById = function(data,cb){
	db.group_message.find({objectIdGroup: data}, function(err, res) {
		return cb(res);
	});
}
