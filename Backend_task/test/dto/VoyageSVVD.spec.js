'use strict';

var chai        = require('chai');
var sinonChai   = require('sinon-chai');
chai.use(sinonChai);
var expect      = chai.expect;
var VoyageSVVD 	= require('../../dto/VoyageSVVD');

describe('VoyageSVVD', function(){
    describe('VoyageSVVD.showSVVD() & VoyageSVVD.showSVVDCC()', function(){
        var obj;

        before(function(done){
            obj = new VoyageSVVD(
                'SCE',
                'ZPY',
                '041',
                'West',
                '1',
                'NYC');
            done();
        });

        it('.showSVVD()', function(done){
            expect(obj.showSVVD()).to.equal('SCE ZPY041W');
            done();
        });

        it('.showSVVDCC()', function(done){
            expect(obj.showSVVDCC()).to.equal('SCE ZPY041W01NYC');
            done();
        });
    });
});