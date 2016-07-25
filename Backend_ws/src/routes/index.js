'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function(app) {
    // Load all other routes
    loadRoutes(__dirname, app);
};

function loadRoutes(dir, app) {
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {

        if (file == 'index.js') {
            return ;
        }

        var fullName = path.join(dir, file);
        var stat = fs.statSync(fullName);

        if (stat && stat.isDirectory()) {
            loadRoutes(fullName, app);
        } else if (fullName.toLowerCase().indexOf('.js') > -1) {
            require(fullName)(app);
        }
    });
}
