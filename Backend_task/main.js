'use strict';
var nconf           = require('nconf');
var async           = require('async');
var P1              = require('./process/p1');
var P2              = require('./process/p2');
var db              = require('./dao/DB');
var config          = require('./config/config');
var logger          = require('./util/Logger');
var backendMonitor  = require('./util/BackendMonitor');
var monitorOption = {
    expectedExecutionTime: config.expectedExecutionTime,
    nextBatchInterval: config.jobInterval,
    nextRetryInterval: config.retryInterval
};
var PROCESS_LIST = [P1,P2];
var MODULE_NAME = 'decisionMaker';

backendMonitor.init(monitorOption);

nconf.argv().env().file('dummy.json');

function _process(pObj,callback){

    logger.info(' // ------ {0} Batch start ---'.format(pObj.NAME));

    pObj.start(function _processStartCb (err, msg){
        if (err){
            logger.error('// ------- {0} Batch error ---'.format(pObj.NAME));
            logger.error(err);
        }else{
            logger.info('// ------- {0} Batch completed ---'.format(pObj.NAME));
        }
        return callback(err, msg);
    });
}

function _getAppConfigs(callback){
    db.getConfig(MODULE_NAME,callback);
}

function _execProcesses(callback){
    async.eachSeries(PROCESS_LIST ,function getCmsEvent_async(pObj, as_callback){
        _process(pObj,as_callback);
    },callback);
}

function _app(callback){
    console.log('==== start ==== ');
    async.series(
        [
            _getAppConfigs,
            _execProcesses
        ],
        function (err, msg){
            if(err)logger.error(err);
            db.cleanUp(function(err2, msg2){
                return callback(err || err2, msg);
            });
        });
}

function _start(callback){
    backendMonitor.recordStartOfProcess();
    _app(callback);
}

function _end(err) {
    backendMonitor.recordEndOfProcess();
    logger.info('================================== Batch completed ==================================');
    if (err){
        setTimeout(batchProcess, config.retryInterval);
    }else{
        setTimeout(batchProcess, config.jobInterval);
    }
};

function batchProcess(){
    logger.info('================================== Batch started ==================================' );
    db.initialize(_start, _end);
};

module.exports = {
    batchProcess: batchProcess
};

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
    module.exports._private = {
        _app            : _app,
        _end            : _end,
        _start          : _start,
        _process        : _process,
        _getAppConfigs  : _getAppConfigs
    }
}



