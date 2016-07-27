'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExampleSchema = new Schema({
    test: String,
    datetime_gmt: Date
}, {
    autoIndex: false
});

module.exports = mongoose.model('Example', ExampleSchema, 'Examples');