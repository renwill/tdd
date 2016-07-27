'use strict';
var winston = require('winston');
var stack = require('callsite');
require('./cmnUtil');
var logger;
var accessLogger;

function dateFormat() {
    return new Date().toISOString();
}

var exportLogger = (function() {
    return {
        initApp : function (config) {
            //LEVELS: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
            // App Logger
            logger = new (winston.Logger)({
                transports: [
                    new (winston.transports.File)({
                        timestamp: function () {
                            return dateFormat();
                        },
                        name: 'app-file',
                        silent: config.logDisabled,
                        filename: config.logPath,
                        level: config.logLevel,
                        handleExceptions: true,
                        humanReadableUnhandledException: true,
                        json: false
                    })
                ],
                exceptionHandlers: [
                    new (winston.transports.File)({
                        filename: config.logExceptionPath,
                        handleExceptions: true,
                        json: false,
                        level: 'error'
                    })
                ],
                exitOnError: false
            });

            // HTTP Access Logger. Used as the stream in morgan
            accessLogger = new (winston.Logger)({
                transports: [
                    new (winston.transports.File)({
                        timestamp: function () {
                            return dateFormat();
                        },
                        name: 'access-file',
                        silent: config.accessLogDisabled,
                        filename: config.accessLogPath,
                        level: config.accessLogLevel,
                        handleExceptions: true,
                        humanReadableUnhandledException: true,
                        json: false
                    })
                ]
            });
        },
        info: function(p_msg){
            logger.info("[{0}] {1}".format(
                stack()[1].getFunctionName() || 'anonymous',
                p_msg));
        },
        error: function(p_err){
            logger.error("[{0}] {1}".format(
                stack()[1].getFunctionName() || 'anonymous',
                p_err));
        },
        log: function(p_cat,p_err){
            logger.log(p_cat, "[{0}] {1}".format(
                stack()[1].getFunctionName() || 'anonymous',
                p_err));
        }
    };
})();

module.exports = exportLogger;

// Logger used by Morgan. The msg sent by Morgan has a '\n' at the end which needs to be removed since
// winston already creates a new line for each message being logged.
module.exports.write = function (msg) {
    var idx = msg.lastIndexOf('\n');
    accessLogger.info(msg.substring(0, idx));
};
