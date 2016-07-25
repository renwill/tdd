'use strict';
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var example = rewire('./../../src/controllers/example');

describe('Example', function() {
    example.__set__('appLogger', {info: function(){}});

    it('should send mock response', function () {
        var res = {json: sinon.spy()};
        example.testExample({}, res);

        expect(res.json).calledWith('test');
    });
});
