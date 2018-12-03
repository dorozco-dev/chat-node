var USE_DB = true;
var mongojs = USE_DB ? require("mongojs") : null;
var db = USE_DB ? mongojs('localhost:27017/chat', ['account','chat','chat_message','group','group_account','group_message','photo_files']) : null;

Database = {};
Database.isValidPassword = function(data,cb){
	if(!USE_DB)
		return cb(true);
	db.account.findOne({username:data.username,password:data.password},function(err,res){
		if(res)
			cb({cb: true, data: res});
		else
			cb({cb: false, data: res});
	});
}

Database.isUsernameTaken = function(data,cb){
	if(!USE_DB)
		return cb(false);
	db.account.findOne({username:data.username},function(err,res){
		if(res)
			cb(true);
		else
			cb(false);
	});
}

Database.addUser = function(data,cb){
	if(!USE_DB)
		return cb();
	db.account.insert(
		{	
		username:data.username,
		password:data.password,
		major:data.major,
		something:data.something,
		fullname:data.fullname
		},function(err){
	});
}	

Database.findAllUsers = function(cb){
	db.account.find(function (err, docs) {
		return cb(docs)
	})
}

Database.addChat = function(data,cb){
	if(!USE_DB)
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
				cb(Database.insertChat(data));
		});
	});
}	

Database.insertChat = function (data){
	db.chat.insert({	
		usernameOne:data.usernameOne,
		usernameTwo:data.usernameTwo,
		time:data.time},function(err, response){
		return response
	});
}

Database.addChatMessage = function(data,cb){
	if(!USE_DB)
		return cb();
	db.chat_message.insert(
		{	
		objectIdChat:data.objectIdChat,
		objectIdAccount:data.objectIdAccount,
		username:data.username,
		message:data.message,
		time:Date()
		},function(err,response){
		 return cb(response)
	});
}	

Database.findChatMessageByChatId = function(data,cb){
	db.chat_message.find({objectIdChat: data}, function(err, res) {
		return cb(res);
	});
}

Database.findChatByUsers = function(data,cb){
	if(!USE_DB)
		return cb(false);
	db.account.findOne({usernameSender:data.username,usernameReceiver:data},function(err,res){
		if(res)
			cb(res);
		else
			cb(false);
	});
}



//GROUP 

Database.addGroupChat = function(data,cb){
	if(!USE_DB)
		return cb();
	
	Database.insertGroupChat(data)
}

Database.insertGroupChat = function (data){
	db.group.insert({	
		groupName:data.groupName,
		time:Date()
		},function(err, response){
			console.log(response);
				db.group_account.insert({
				groupId: response._id.toString(),
				groupName:data.groupName,
				accountId: data.accountId
			},function(err,response){});
		
	});
}

Database.AddUserToGroup = function (data){
	
	for(var i = 0; i < data.length; i ++){
		value = data[i];
		console.log(value)
		if(value.checked){
			db.group_account.insert({groupId: value.groupId.toString(),
			groupName:value.groupName,
			username:value.username,
			accountId: value._id},function(err,response){});	
		}

	}						
}


Database.addGroupMessage = function(data,cb){
	if(!USE_DB)
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

Database.findGroupChatByAccountId = function(data,cb){
	db.group_account.find({accountId: data}, function(err, res) {
		return cb(res);
	});
}

Database.findUsersByGroupId = function(data,cb){
	db.group_account.find({groupId: data}, function(err, res) {
		return cb(res);
	});
}

Database.findGroupChatMessagesById = function(data,cb){
	db.group_message.find({objectIdGroup: data}, function(err, res) {
		return cb(res);
	});
}


Database.addPhotoProfile = function(data,cb){
	if(!USE_DB)
		return cb();
	
	db.photo_files.update({idAccount: data.idAccount}, { active: 0 }, function () {
	})

				
	db.photo_files.insert(
	{photo: data.photo, path: data.path, idAccount: data.idAccount, active: 1, pathServer: data.pathServer}
		,function(err,response){
		 return cb(response)
	});
}	

Database.findPhotoByIdAccount = function(data,cb){
	db.photo_files.findOne({idAccount: data, active: 1}, function(err, res) {
		return cb(res);
	});
}



