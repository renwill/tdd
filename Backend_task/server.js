'use strict';
var express         = require('express');
var main            = require('./main');
var db              = require('./dao/DB');
var logger          = require('./util/Logger');
var BackendMonitor  = require('./util/BackendMonitor');

var app = express();

app.get('/', function(req, res){
    BackendMonitor.app(req,res,'sample_project');
});

app.get('/supportUse', function(req, res){
    res.send(BackendMonitor.supportUse());
});

app.listen(8081);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', db.disconnect).on('SIGTERM', db.disconnect);
process.on('uncaughtException', function processOnException(err) {
    logger.error(err);
    logger.info('-----exit app-------');
    process.exit(1);
});

main.batchProcess();
