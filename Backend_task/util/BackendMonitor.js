'use strict';
var moment = require('moment');

var initialStartupTime;
var dt_start;
var dt_end;
var t_exec;
var t_sleep;

var backendStatus = {
    DIE_IN_EXECUTION: 'DIE_IN_EXECUTION',
    LONG_EXECUTION: 'LONG_EXECUTION',
    EXECUTING: 'EXECUTING',
    DIE_IN_SLEEP: 'DIE_IN_SLEEP',
    SLEEPING: 'SLEEPING'
}

function init(option){
    initialStartupTime = new Date();

    // default 1 hr
    t_exec = option.expectedExecutionTime || 60 * 60 * 1000;
    var t_nextBatch = option.nextBatchInterval || 60 * 60 * 1000;
    var t_nextRetry = option.nextRetryInterval || 60 * 60 * 1000;

    t_sleep = Math.max(t_nextBatch, t_nextRetry);
}

function recordStartOfProcess(){
    dt_start = new Date();
    dt_end = null;
}

function recordEndOfProcess(){
    dt_end = new Date();
}

function guessStatus(){

    // job started, but not end
    if (!dt_end){
        // very long execution
        if (moment().diff(dt_start) > 2 * t_exec){
            return backendStatus.DIE_IN_EXECUTION;
        } // long execution
        else if (moment().diff(dt_start) > t_exec){
            return backendStatus.LONG_EXECUTION;
        }else{
            return backendStatus.EXECUTING;
        }
    } // job ended, waiting next start
    else{
        if (moment().diff(dt_end) > t_sleep){
            return backendStatus.DIE_IN_SLEEP;
        }
        else{
            return backendStatus.SLEEPING;
        }
    }
}

function supportUse(){
    var json = {
        initialStartupTime: initialStartupTime,
        dt_start: dt_start,
        dt_end: dt_end,
        t_exec: t_exec,
        t_sleep: t_sleep,
        time_now: new Date(),
        guessStatus: guessStatus()
    };

    return JSON.stringify(json, null, 2);
}

function simulateError(chance){
    if (Math.random() < chance / 100){
        var a = b;
    }
}

function app(req,res,p_module){
    var status = guessStatus();
    var msg = '{0} is running...!'.format(p_module);
    switch (status){
        case backendStatus.DIE_IN_EXECUTION:
        case backendStatus.DIE_IN_SLEEP:
            res.sendStatus(404);
            break;
        case backendStatus.EXECUTING:
        case backendStatus.LONG_EXECUTION:
        case backendStatus.SLEEPING:
            res.send(msg);
            break;
        default:
            res.send(msg);
            break;
    }
}

module.exports = {
    app:                    app,
    init:                   init,
    supportUse:             supportUse,
    guessStatus:            guessStatus,
    recordEndOfProcess:     recordEndOfProcess,
    recordStartOfProcess:   recordStartOfProcess,
    backendStatus:          backendStatus
};

if (process.env.NODE_ENV === 'test') {
    module.exports._private = {
        simulateError: simulateError
    }
}



