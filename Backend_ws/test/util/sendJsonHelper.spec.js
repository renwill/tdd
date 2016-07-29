'use strict';
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var sendJsonHelper = rewire('./../../src/util/sendJsonHelper');

describe('sendJsonHelper', function() {
    describe('sendJson', function() {
        it('should wrap unsuccessful call', function () {
            var res = {json: sinon.spy()};

            sendJsonHelper.sendErr(res, 'mock err data');
            expect(res.json).calledWith({
                success: false,
                data: 'mock err data'
            });
            expect(res.json).calledOnce;
        });
        
        it('should wrap successful call', function () {
            var res = {json: sinon.spy()};

            sendJsonHelper.sendJson(res, 'mock data');
            expect(res.json).calledWith({success: true, data: 'mock data'});
            expect(res.json).calledOnce;
        });
    });
});