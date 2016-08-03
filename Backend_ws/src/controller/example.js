'use strict';
var Example = require('./../model/example');
var wsUtil = require('./../util/sendJsonHelper');
var appLogger = global.appLogger;

module.exports = {
    testExample: function(req, res, next) {
        appLogger.info('example called');

        Example.create({
            test: 'test message',
            datetime_gmt: new Date()
        }, function (err) {
            if (err) {
                return next(err);
            }
            else {
                wsUtil.sendJson(res, 'test completed.');
            }
        });
    }
};