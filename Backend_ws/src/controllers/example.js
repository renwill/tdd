'use strict';
var appLogger = global.appLogger;

module.exports = function () {
    var ctrl = {};

    ctrl.example = function(req, res, next) {
        appLogger.info('called');
        res.send('test');
    };

    return ctrl;
};