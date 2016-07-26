'use strict';
var appLogger = global.appLogger;

module.exports = {
    testExample: function(req, res, next) {
        appLogger.info('example called');
        res.json('test');
    }
};