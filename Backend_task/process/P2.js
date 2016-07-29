'use strict';
var nconf   = require('nconf');
var NAME    = 'P2';
var logger  = require('../util/Logger');

function start(mainCallback) {
    var mConfig= nconf.get('mConfig');
    var nConfig= nconf.get('nConfig');

    if (!mConfig || !nConfig){
        return mainCallback(new Error('No config is found'));
    }

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
