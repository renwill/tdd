module.exports = function(callback){
	setTimeout(function(){
		callback(null, 'done');
	}, 10000);
};