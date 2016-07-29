'use strict';

var chai        = require('chai');
var sinon       = require('sinon');
var rewire 	    = require('rewire');
var sinonChai   = require('sinon-chai');
chai.use(sinonChai);
var expect      = chai.expect;
var db 	        = rewire('../../dao/DB');

describe('DB', function(){
    describe('DB._massageConfig()', function(){
        it('should manipulate config', function(done){
            var _massageConfig = db.__get__('_massageConfig');
            var end = sinon.spy();
            _massageConfig(null,'test',function(obj,callback){
                expect(obj).to.equal('test');
                return callback();
            },end);
            expect(end).calledOnce;
            done();
        });
    });
});