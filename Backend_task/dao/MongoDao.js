'use strict';
var _                   = require('lodash');
var nconf               = require('nconf');
var mongoose            = require('mongoose');
var cmnUtil             = require('../util/cmnUtil');
var logger              = require('../util/Logger');
var config 	            = require('../config/config');
var ModuleConfigs       = require('../model/ModuleConfigs');

var connection;
var options  = { server: { socketOptions: { connectTimeoutMS : config.dbConnectTimeoutMS }}};

function initialize(start,end) {
    if (mongoose.connection.readyState !== 1) {
        logger.info('Mongo DB is not yet connected, trying to connect...');
        connection = mongoose.connect(config.dbUrl, options, function mongooseConnect(err){
            if (err) {
                logger.error('DB cannot be connected. Process failed to be started.');
                return end();
            } else {
                logger.info('DB connected.');
                return start(end);
            }
        });
    } else {
        logger.info('DB connection exists.');
        return start(end);
    }
}

function getModuleConfigs(p_module, callback) {
    ModuleConfigs.findOne({module: p_module}, {_id:0,values:1}, callback);
}

function disconnect() {
    connection.disconnect(function mongooseDisconnect(){
        logger.info('DB disconnected.');
        process.exit(0);
    });
}

function debug() {
    connection.set('debug', true);
}

function debugOff() {
    connection.set('debug', false);
}

function state(){
        return mongoose.connection.readyState;
    }

// export the class
module.exports = {
    // system methods
    initialize: initialize,
    disconnect: disconnect,
    debug: debug,
    debugOff: debugOff,
    state: state,

    // public methods
    getModuleConfigs: getModuleConfigs
};
