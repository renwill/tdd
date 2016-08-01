'use strict';
var async   = require('async');
var nconf   = require('nconf');
var domain  = require('domain');
var logger  = require('../util/Logger');

var NAME    = 'P1';

function start(mainCallback) {
    var d = domain.create();
    var currentObj;

    // process start.........
    logger.info('---- executing  --------');

    d.on('error', function domainError(err) {
        logger.error('domain.onError Obj : {0}'.format(currentObj));
        logger.error('domain.onError : {0}'.format(err.stack));
        _skipProblematicRequest(currentObj,mainCallback);
    });

    var list = [1,2,3,4];
    async.eachSeries(list ,function getCmsEvent_async(obj,as_callback){
        currentObj = obj;

        // Enter this domain
        d.run(function domainRun() {
            logger.info('domain.run {0}'.format(obj));
            // If an un-handled error originates from here, process.domain will handle it
            _eachItemProcess(obj,as_callback);
        });
    },mainCallback);
}

function _eachItemProcess(obj, callback){
    if(obj==3){
        logger.info('error sample process item {0}'.format(obj));
        var tmp = 1/a;
        return callback(null);
    }else{
        logger.info('normal process item {0}'.format(obj));
        return callback(null);
    }
}

function _skipProblematicRequest(obj,callback){
    logger.error('skip process for the item : {0}'.format(obj));
    return callback();
}

/********************************************/
/*************** Export Object **************/
/********************************************/
module.exports = {
    NAME:   NAME,
    start:  start
};
