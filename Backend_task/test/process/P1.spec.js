'use strict';

var chai        = require('chai');
var sinon       = require('sinon');
var rewire 	    = require('rewire');
var sinonChai   = require('sinon-chai');
chai.use(sinonChai);
var expect      = chai.expect;
var P1 	        = rewire('../../process/P1');

describe('P1', function(){
    describe('P1._eachItemProcess()', function(){
        it('should have no error', function(done){
            var _eachItemProcess = P1.__get__('_eachItemProcess');
            _eachItemProcess(2,function(err){
                expect(err).to.not.exist;
                done();
            });
        });
    });
});