var People = require('./people.model');

module.exports = {
	findUser : function(name, callback){
		People.find({
			name: name
		}, function(err, people){
			if (err)
				callback(err);
			else
				callback(null, people);
		});
	}
};