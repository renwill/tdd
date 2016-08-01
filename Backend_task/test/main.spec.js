'use strict';

var chai        = require('chai');
var nconf       = require('nconf');
var sinon       = require('sinon');
var rewire      = require('rewire');
var sinonChai   = require('sinon-chai');
chai.use(sinonChai);
var expect      = chai.expect;
var main        = rewire('../main');
var logger      = require('../util/Logger');

describe('main', function () {
    before(function(done){
        nconf.argv().env().file('dummy.json');
        nconf.set('logPath','./logs/');
        logger.init();
        done();
    });
    describe('main._app()', function () {
        var revert_getDBConfigs;
        var revert_execProcesses;

        it('should retrieve config and execute processes', function (done) {
            var _app = main.__get__('_app');

            var spy_execProcesses = sinon.spy();
            var spy_getDBConfigs = sinon.spy();

            revert_getDBConfigs = main.__set__('_getDBConfigs', function (callback) {
                spy_getDBConfigs();
                callback();
            });
            revert_execProcesses = main.__set__('_execProcesses', function (callback) {
                spy_execProcesses();
                callback();
            });

            _app(function () {
                expect(spy_getDBConfigs).calledOnce;
                expect(spy_execProcesses).calledOnce;
                done();
            });
        });

        after(function(done){
            revert_getDBConfigs();
            revert_execProcesses();
            done();
        });
    });
    describe('main._process()', function () {
        it('should execute start() in process', function (done) {
            var _process = main.__get__('_process');
            var P = (function () {
                return {
                    start: function () {}
                };
            })();

            var spy_process = sinon.stub(P, 'start', function (callback) {
                callback();
            });

            _process(P, function () {
                expect(spy_process).calledOnce;
                done();
            });
        });
    });
});