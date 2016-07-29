'use strict';
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var sinon = require('sinon');
var rewire = require('rewire');
var index = rewire('./../../src/route/index');
var mock = require('mock-fs');

describe('Model index.js', function() {

    describe('When has one module file', function(){
        before(function(done){
            mock({
                'index.js' : 'empty content',
                'test.js' : 'empty content',
                'b.txt' : 'empty content'
            });
            done();
        });

        it('should load model files', function () {
            var stub = sinon.stub();

            index.__set__('requireModule', stub);
            var loadRoutes = index.__get__('loadRoutes');

            loadRoutes('./', {});
            expect(stub).to.have.been.called.Once;

            stub.reset();
        });

        after(function(done){
            mock.restore();
            done();
        });
    });

    describe('When has two module file', function(){
        before(function(done){
            mock({
                'test.js' : 'empty content',
                'test1.js' : 'empty content',
                'b.txt' : 'empty content'
            });
            done();
        });

        it('should load model files', function () {
            var stub = sinon.stub();

            index.__set__('requireModule', stub);
            var loadRoutes = index.__get__('loadRoutes');

            loadRoutes('./', {});
            expect(stub).to.have.been.called.twice;

            stub.reset();
        });

        after(function(done){
            mock.restore();
            done();
        });
    });

    describe('When has no module file', function(){
        before(function(done){
            mock({
                'b.txt' : 'empty content'
            });
            done();
        });

        it('should not load any model file', function () {
            var stub = sinon.stub();

            index.__set__('requireModule', stub);
            var loadRoutes = index.__get__('loadRoutes');

            loadRoutes('./', {});
            expect(stub).to.not.have.been.called;

            stub.reset();
        });

        after(function(done){
            mock.restore();
            done();
        });
    });

});
