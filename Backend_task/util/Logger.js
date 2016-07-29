'use strict';
var path 	= require('path');
var winston = require('winston');
var stack   = require('callsite');
var cmnUtil = require('./cmnUtil');
var config  = require('../config/config');

winston.emitErrs = true;

var GenericLogger = new winston.Logger({
    transports: [
        new (winston.transports.File)({
            filename: path.join(config.logPath, 'program.log'),
            handleExceptions: true,
            json: false
        })
    ],
    exceptionHandlers: [
        new (winston.transports.File)({
            filename: path.join(config.logPath, 'exception.log'),
            handleExceptions: true,
            json: false
        })
    ],
    exitOnError: false
});

var logger = (function(){
    return {
        info: function(p_msg){
            GenericLogger.info('[{0}] {1}'.format(
                stack()[1].getFunctionName() || 'anonymous',
                p_msg));
        },
        error: function(p_err){
            GenericLogger.error('[{0}] {1}'.format(
                stack()[1].getFunctionName() || 'anonymous',
                p_err));
        },
        log: function(p_cat,p_err){
            GenericLogger.log(p_cat,'[{0}] {1}'.format(
                stack()[1].getFunctionName() || 'anonymous',
                p_err));
        }
    };
})();

module.exports = logger;