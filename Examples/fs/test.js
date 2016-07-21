var mock = require('mock-fs');
var fs = require('fs');
var expect = require('chai').expect;


describe('fs testing', function(){

	before(function(done){
		mock({
			'a.txt' : 'abc',
			'b.txt' : 'abc'
		});
		done();
	});

	it('should show 2 files', function(done){
		fs.readdir('./', function(err, files){
			expect(err).to.be.null;
			expect(files).to.be.Array;
			expect(files).to.be.lengthOf(2);
			console.log(files);
			expect(files).to.include.members(['a.txt', 'b.txt']);
			done();
		});
	});

	after(function(done){
		mock.restore();
		done();
	});
});