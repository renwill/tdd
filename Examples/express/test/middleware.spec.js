/**
 * Created by MAOLY on 6/28/2016.
 */
'use strict';
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var header = rewire('./../app/middleware');

describe('Middleware', function() {
    describe('getTitle1', function (){
        it('should return correct msg', function () {
            var res = { json: sinon.spy()};
            var next = sinon.stub();
            header.getTitle1({}, res, next);
            expect(res.json).calledWith({success: true, data: 'NOE DQ Dashboard 2.0'});
            expect(next).calledOnce;
        });

    });

    describe('getTitle1', function (){
        it('should call sendJson to return message', function () {
            var sendJsonMock = sinon.spy();
            var next = sinon.stub();

            header.__set__('sendJson', sendJsonMock);
            header.getTitle({}, {}, next);
            expect(sendJsonMock).calledOnce;
            expect(sendJsonMock).calledWith({}, 'NOE DQ Dashboard 2.0');
        });
    });
});