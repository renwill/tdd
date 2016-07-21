var http = require('http');

module.exports = function(callback){
	var req = http.request({
			hostname: 'localhost',
			port:8080,
			path: '/api'
		}, function(response) {
			var data = '';
			response.on('data', function(chunk) {
				data += chunk;
			});
 
			response.on('end', function() {
				callback(null, JSON.parse(data));
			});
		});
 
		req.end();
};