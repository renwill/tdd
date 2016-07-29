'use strict';

var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var main = rewire('../main');

describe('main', function () {
    describe('main._app()', function () {
        var revert_getAppConfigs;
        var revert_execProcesses;

        it('should retrieve config and execute processes', function (done) {
            var _app = main.__get__('_app');

            var spy_execProcesses = sinon.spy();
            var spy_getAppConfigs = sinon.spy();

            revert_getAppConfigs = main.__set__('_getAppConfigs', function (callback) {
                spy_getAppConfigs();
                callback();
            });
            revert_execProcesses = main.__set__('_execProcesses', function (callback) {
                spy_execProcesses();
                callback();
            });

            _app(function () {
                expect(spy_getAppConfigs).calledOnce;
                expect(spy_execProcesses).calledOnce;
                done();
            });
        });

        after(function(done){
            revert_getAppConfigs();
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