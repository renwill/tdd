/**
 * Created by MAOLY on 7/28/2016.
 */
'use strict';
var chai = require('chai');
var expect = chai.expect;


describe('CmnUtil', function() {
    it('Should extend format to string prototype', function() {
        delete String.prototype.format;
        expect(String.prototype.hasOwnProperty('format')).to.be.false;
        require('./../../src/util/CmnUtil');
        expect(String.prototype.hasOwnProperty('format')).to.be.true;

        // Delete require cache
        delete require.cache[require.resolve('./../../src/util/CmnUtil')];
        // Else branch test
        require('./../../src/util/CmnUtil');
        expect(String.prototype.hasOwnProperty('format')).to.be.true;
    });


    it('Should extend format to string prototype', function() {
        expect('{0}'.format('test')).to.equal('test');
        expect('{0}_{1}'.format('test1', 'test2')).to.equal('test1_test2');
        expect('{0}_{1}'.format('test1')).to.equal('test1_{1}');
    });
});