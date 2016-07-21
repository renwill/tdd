var sinon = require('sinon');
var wsReq = require('./request.example');
var wsHttp = require('./http.example');
var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var PassThrough = require('stream').PassThrough;
var nock = require('nock');

describe('Web service testing', function(){

	describe('Using request library', function(){
		var stub;
		before(function(done){
			stub = sinon.stub(request, "get");
			var res = {
				statusCode:200,
				body: 'abc'
			};
			stub.yields(null, res, res.body);
			done();
		});

		it('should return body as return message from WS', function(done){
			wsReq(function(err, result){
				expect(err).to.be.null;
				expect(result).to.be.equal('abc');
				done();
			});
		});

		after(function(done){
			stub.restore();
			done();
		});
	});

	describe('Using http library', function(){

		describe('Using Sinon', function(){
			var stub;
			before(function(done){
				stub = sinon.stub(http, "request");
				var expected = { hello: 'world' };
				var response = new PassThrough();
				response.write(JSON.stringify(expected));
				response.end();
			 
				var request = new PassThrough();
			 
				stub.callsArgWith(1, response)
				    .returns(request);
				done();
			});

			it('should return obj', function(done){
				wsHttp(function(err, result){
					expect(err).to.be.null;
					expect(result).to.be.deep.equal({hello: 'world'});
					done();
				});
			});

			after(function(done){
				stub.restore();
				done();
			});
		});


		describe('Using nock', function(){
			var stub;
			var scope;
			before(function(done){
				scope = nock('http://localhost:8080')
						    .get('/api')
						    .reply(200, {hello: 'world'});
				done();
			});

			it('should return obj', function(done){
				wsHttp(function(err, result){
					expect(err).to.be.null;
					expect(result).to.be.deep.equal({hello: 'world'});
					expect(scope.isDone()).to.be.true;
					done();
				});
			});

			after(function(done){
				nock.restore();
				done();
			});
		});
	});
});