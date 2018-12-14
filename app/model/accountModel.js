var dbConst = require('../database/Database');

var mongojs = dbConst.USE_DB ? require("mongojs") : null;
var db = dbConst.USE_DB ? mongojs(dbConst.url, ['account','photo_files']) : null;

Database = {};

exports.findAllUsers = function(cb){
	db.account.find(function (err, account) {
		return cb(account)
	})
}

exports.isValidPassword = function(data,cb){
	if(!dbConst.USE_DB)
		return cb(true);
	db.account.findOne({username:data.username,password:data.password},function(err,res){
		if(res)
			cb({cb: true, data: res});
		else
			cb({cb: false, data: res});
	});
}

exports.isUsernameTaken = function(data,cb){
	if(!dbConst.USE_DB)
		return cb(false);
	db.account.findOne({username:data.username},function(err,res){
		if(res)
			cb(true);
		else
			cb(false);
	});
}

exports.addAccount = function(data,cb){
	if(!dbConst.USE_DB)
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

exports.addPhotoProfile = function(data,cb){
	if(!dbConst.USE_DB)
		return cb();
	
	db.photo_files.update({idAccount: data.idAccount}, { active: 0 }, function () {
	})

				
	db.photo_files.insert(
	{photo: data.photo, path: data.path, idAccount: data.idAccount, active: 1, pathServer: data.pathServer}
		,function(err,response){
		 return cb(response)
	});
}	

exports.findPhotoByIdAccount = function(data,cb){
	db.photo_files.findOne({idAccount: data, active: 1}, function(err, res) {
		return cb(res);
	});
}
