/**
 * Created by MAOLY on 6/28/2016.
 */
'use strict';
function sendJson(res, data) {
    res.json({success: true, data: data});
}

module.exports = {
    getTitle : function (req, res, next) {
        sendJson(res, "NOE DQ Dashboard 2.0");
        next();
    },

    getTitle1 : function (req, res, next) {
        res.json({success: true, data: "NOE DQ Dashboard 2.0"});
        next();
    }
};