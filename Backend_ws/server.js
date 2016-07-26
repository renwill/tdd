'use strict';
/***************************************************
 * Config Setup
 ***************************************************/
var path = require('path');
var fs = require('fs');
var nconf = require('nconf');
var winston = require('winston');
var configDir = path.join(__dirname, 'config');
var appLogger;
var appConfigPath;
var defaultConfigPath;

/* load application config */
try {
    appConfigPath = path.join(configDir, 'config.json');
    if (!fs.existsSync(appConfigPath)) {
        console.log(new Date().toISOString(), 'Missing application config! Expected config file at path: ', appConfigPath);
    } else {
        nconf.use('app', {
            type : 'file',
            file : appConfigPath
        });
    }
} catch (e) {
    console.log(new Date().toISOString(), 'Error in reading application config:', appConfigPath, e);
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
    console.log(new Date().toISOString(), 'Error in reading Default Config:', defaultConfigPath, e);
}

/***************************************************
 * Winston Setup
 ***************************************************/
// Add appLogger to global object so it can be accessed by all modules
global.appLogger = require(path.join(__dirname, 'src', 'assets', 'appLogger'));
appLogger = global.appLogger;
appLogger.initApp(nconf.get('loggerConfig'));


/* Handle process level uncaught exceptions */
process.on('uncaughtException', function (err) {
    appLogger['error'].apply(this, arguments);
    process.exit(1);
});

process.on('unhandledRejection', function(reason, p) {
    appLogger['error'].apply(this, arguments);
    process.exit(1);
});

process.on('SIGTERM', function() {
    appLogger.info('Shutting down');
    process.exit(1);
});

require('./express');