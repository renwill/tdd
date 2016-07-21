var User = require('./user.model');

module.exports = {
	findUser : function(name, callback){
		User.find({
			name: name
		}, function(err, users){
			if (err)
				callback(err);
			else
				callback(null, users);
		});
	},

	findUserChaining : function(name, callback){
		User.find({
			name: name
		}).sort({name: 1})
		.exec(function(err, users){
			if (err)
				callback(err);
			else
				callback(null, users);
		});
	}
};