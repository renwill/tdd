/**
 * Created by HOUDR on 7/19/2016.
 */
'use strict';

var chai = require("chai");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var expect = chai.expect;
var sinon = require('sinon');


/***Use rewire***/
var rewire 	= require('rewire');
var kitten 	= rewire('../../app/kitten'); 

/*** test private function ***/
describe('kitten', function(){
	it('should have different sounds', function(done){
		var _words = kitten.__get__('words');
		expect(_words('angry')).to.not.equal(_words('satisfied'));
		done();
	});

	it('should meow when satisfied', function(done){
		var wordsSpy = sinon.spy();
		var revert = kitten.__set__('words', wordsSpy);
		kitten.speaks();
		expect(wordsSpy).calledOnce;
		expect(wordsSpy).calledWith('satisfied');
		revert();
		done();
	});
});