'use strict';
var appLogger = global.appLogger;

module.exports = {
    testExample: function(req, res, next) {
        appLogger.info('called');
        res.json('test');
    }
};