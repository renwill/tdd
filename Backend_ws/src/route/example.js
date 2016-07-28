'use strict';

module.exports = function(app) {
    var module = require(app.locals.getCtrlPath('example'));

    app.get('/example', module.testExample);
    
};
