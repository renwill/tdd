var userCtrl = require('./user.controller');
var User = require('./user.model');
var expect = require('chai').expect;
var sinon = require('sinon');
var mongoose = require('mongoose');
require('sinon-mongoose');

describe('Mongoose testing', function(){

	describe('Using sinon', function(){
		var stub;
		before(function(done){
			stub = sinon.stub(mongoose.Model, 'find');			
			var res = [{name: 'apple'}];
			stub.yields(null, res);
			done();
		});

		it('should return user', function(done){
			userCtrl.findUser('apple', function(err, users){
				expect(err).to.be.null;
				expect(users).to.be.deep.equal([{name: 'apple'}]);
				done();
			});
		});
		after(function(done){
			stub.restore();
			done();
		});
	});

	describe('Using sinon-mongoose', function(){
		var mock;
		before(function(done){
			mock = sinon.mock(User);			
			mock.expects('find')
			    .chain('sort').withArgs({name: 1})
			    .chain('exec')
			    .yields(null, [{name: 'apple'}]);
			done();
		});

		it('should return user', function(done){
			userCtrl.findUserChaining('apple', function(err, users){
				mock.verify();
				expect(err).to.be.null;
				expect(users).to.be.deep.equal([{name: 'apple'}]);
				done();
			});
		});
		after(function(done){
			mock.restore();
			done();
		});
	});
});