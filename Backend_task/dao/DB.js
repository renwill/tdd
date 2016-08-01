'use strict';
var _               = require('lodash');
var async           = require('async');
var nconf           = require('nconf');
var cmnUtil         = require('../util/cmnUtil');
var logger          = require('../util/Logger');
var MongoDao        = require('../dao/MongoDao');
var OracleDao       = require('../dao/OracleDao');
var ModuleConfigs   = require('../model/ModuleConfigs');

function cleanUp(callback){
    OracleDao.cleanUp(callback);
}

function getConfig(p_module_name,callback){
    async.parallel([function(ap_callback){
        MongoDao.getModuleConfigs(p_module_name,
            function ModuleConfig(err, obj) {
                _massageConfig(err,obj,function manipulateModuleConfig(obj,cb){
                    logger.info('module config: ' + JSON.stringify(obj.values));
                    //nconf.set('mConfig', obj.values);
                    nconf.add('module', { type: 'literal', store: obj.values});
                    cb(null, 1);
                },ap_callback);
            });
    },
    function(ap_callback){
        // get region config, etc.....
        ap_callback();
    }],callback);
}

function _massageConfig(err,obj,handling,callback){
    if (err){
        logger.error(err);
        return callback(err, null);
    }else if (!obj){
        logger.error(new Error('No config in ModuleConfigs'));
        return callback(new Error('No config in ModuleConfigs'), null);
    }else{
        return handling(obj,callback);
    }
}

// export the class
module.exports = {
    // system methods
    initialize          : MongoDao.initialize,
    disconnect          : MongoDao.disconnect,
    debug               : MongoDao.debug,
    debugOff            : MongoDao.debugOff,
    state               : MongoDao.state,

    // public methods
    cleanUp             : cleanUp,
    getConfig           : getConfig
};