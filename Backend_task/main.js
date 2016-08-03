'use strict';
var fs              = require('fs');
var path            = require('path');
var nconf           = require('nconf');
var async           = require('async');
var P1              = require('./process/p1');
var P2              = require('./process/p2');
var db              = require('./dao/DB');
var logger          = require('./util/Logger');
var backendMonitor  = require('./util/BackendMonitor');
var configDir       = path.join(__dirname, 'config');
var PROCESS_LIST    = [P1,P2];
var MODULE_NAME     = 'decisionMaker';
var appConfigPath;
var monitorOption;
var defaultConfigPath;

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

function _initBackendMonitor(){
    monitorOption = {
        expectedExecutionTime   : nconf.get('expectedExecutionTime'),
        nextBatchInterval       : nconf.get('jobInterval'),
        nextRetryInterval       : nconf.get('retryInterval')
    };
    backendMonitor.init(monitorOption);
}

function _getAppConfigs(callback){

    /* load application config */
    try {
        appConfigPath = path.join(configDir, 'config.json');
        if (!fs.existsSync(appConfigPath)) {
            console.log(new Date().toISOString(), 'Missing application config! Expected config file at path: ', appConfigPath);
            //return callback(new Error('No application config is found.'));
        } else {
            nconf.use('app', {
                type : 'file',
                file : appConfigPath
            });
        }
    } catch (e) {
        console.log(new Date().toISOString(), 'Error in reading application config:', appConfigPath, e);
        //return callback(new Error('Error in reading application config: {0} ({1})'.format(appConfigPath, e)));
    }

    /* load default config */
    try {
        defaultConfigPath = path.join(configDir, 'default-config.json');
        if (!fs.existsSync(defaultConfigPath)) {
            console.log(new Date().toISOString(), 'Missing default config! Expected config file at path: ', defaultConfigPath);
        } else {
            nconf.use('default', {
                type : 'file',
                file : defaultConfigPath
            });
        }
    } catch (e) {
        console.log(new Date().toISOString(), 'Error in reading default Config:', defaultConfigPath, e);
    }
    return callback();
}

function _getDBConfigs(callback){
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
            _getDBConfigs,
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
        setTimeout(batchProcess, nconf.get('retryInterval'));
    }else{
        setTimeout(batchProcess, nconf.get('jobInterval'));
    }
}

function batchProcess(){
    _getAppConfigs(function(err){
        if(err)
            throw err;
        _initBackendMonitor();
        logger.init();
        logger.info('================================== Batch started ==================================' );
        db.initialize(_start, _end);
    });
}

module.exports = {
    batchProcess: batchProcess
};



