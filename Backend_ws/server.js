'use strict';

global.componentId = 'njdomxxxxxxx';
/***************************************************
 * Config Setup
 ***************************************************/
var path = require('path');
var fs = require('fs');
var nconf = require('nconf');
var winston = require('winston');
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');

var logDir = path.join(__dirname, 'logs');
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
        nconf.use(global.componentId + '-app', {
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
        nconf.use(global.componentId + '-default', {
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
global.appLogger = require(path.join(__dirname, 'src', 'utils', 'appLogger'));
appLogger = global.appLogger;
appLogger.initApp(nconf.get('loggerConfig'));


// app.use(express.static(__dirname + '/public'));

// HTTP Request Logging
app.use(morgan(':remote-addr :method :url :status :response-time ms', {stream: appLogger}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/***************************************************
 * Models and Routes Setup
 ***************************************************/
app.locals.getCtrlPath = function(pCtrlName) {
    return path.join(__dirname, 'src', 'controllers', pCtrlName);
};
require('./src/routes')(app);


/***************************************************
 * Exception Handling Setup
 ***************************************************/
/* Handle router level uncaught exceptions */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({success: false, data: err.message});
    appLogger.error(err);
});

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
    process.exit(0);
});

app.listen(8080, function(){
    appLogger.info('Express server listening on port 8080');
});