var sinon = require('sinon');
var foo = require('./foo');
var expect = require('chai').expect;

var clock;

describe('setTimeout testing', function(){
	before(function(done) {
	     clock = sinon.useFakeTimers();
	     done();
	 });


	it("should finish the function before 10s", function(done) {
		this.timeout(10000);
	    foo(function(err, res){
	    	expect(res).to.be.equal('done');
	    	done();
	    });
	    clock.tick(10000);
	});

	after(function(done) {
	    clock.restore();
	    done();
	});

})