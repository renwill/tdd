'use strict';
//var util = require('util');
var winston = require('winston');
var logger;
var accessLogger;

function dateFormat() {
	return new Date().toISOString();
}

module.exports.initApp = function(config) {
	//LEVELS: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
	// App Logger
	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.File)({
				timestamp: function() {
					return dateFormat();
				},
				name: 'app-file',
				silent: config.logDisabled,
				filename: config.logPath,
				level: config.logLevel,
				handleExceptions: true,
				humanReadableUnhandledException: true,
				json: false,
				tailable: true,
				zippedArchive: true
			})
		]
	});

	// HTTP Access Logger. Used as the stream in morgan
	accessLogger = new (winston.Logger)({
		transports: [
			new (winston.transports.File)({
				timestamp: function() {
					return dateFormat();
				},
				name: 'access-file',
				silent: config.accessLogDisabled,
				filename: config.accessLogPath,
				level: config.accessLogLevel,
				handleExceptions: true,
				humanReadableUnhandledException: true,
				json: false,
				tailable: true,
				zippedArchive: true
			})
		]
	});
};

module.exports.error = function() {
	logger['error'].apply(this, arguments);
};
module.exports.warn = function() {
	logger['warn'].apply(this, arguments);
};
module.exports.info = function() {
	logger['info'].apply(this, arguments);
};
module.exports.verbose = function() {
	logger['verbose'].apply(this, arguments);
};
module.exports.debug = function() {
	logger['debug'].apply(this, arguments);
};
module.exports.silly = function() {
	logger['silly'].apply(this, arguments);
};

// Logger used by Morgan. The msg sent by Morgan has a '\n' at the end which needs to be removed since
// winston already creates a new line for each message being logged.
module.exports.write = function(msg) {
	var idx = msg.lastIndexOf('\n');
	accessLogger.info(msg.substring(0, idx));
};
