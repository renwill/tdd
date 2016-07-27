'use strict';
exports.sendJson = function sendJson(res, data) {
    //send a successful json result back
    //console.log(data);
    res.json({success: true, data: data});
};

exports.sendErr = function sendErr(res, err) {
    //send back a failure result
    res.json({success: false, data: err});
};