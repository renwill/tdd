var request = require('request');

module.exports = function(callback){
	request.get('http://localhost:8080/api', function(err, res, body){
		if (err)
			callback(err);
		else{
			callback(null, body);
		}
	});
}