'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function (mongoose) {
    var obj = {};
    loadModels(__dirname, obj, mongoose);
    return obj;
};

function loadModels(dir, obj, mongoose) {
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {

        if (file == 'index.js') {
            return;
        }

        var fullName = path.join(dir, file);
        var stat = fs.statSync(fullName);

        /* istanbul ignore if */
        if (stat && stat.isDirectory()) {
            loadModels(fullName, obj, mongoose);
        } else if (fullName.toLowerCase().indexOf('.js') > -1) {
            loadOneModel(fullName, obj, mongoose);
        }
    });
}

/* istanbul ignore next */
function loadOneModel(fullName, obj, mongoose) {
    var model = require(fullName)(mongoose);
    _.extend(obj, model);
}