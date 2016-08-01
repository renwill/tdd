'use strict';
var nconf   = require('nconf');
var NAME    = 'P2';
var logger  = require('../util/Logger');

function start(mainCallback) {
    // process start.........
    logger.info('---- executing  --------');
    return mainCallback(null);
}

/********************************************/
/*************** Export Object **************/
/********************************************/
module.exports = {
    NAME:   NAME,
    start:  start
};
