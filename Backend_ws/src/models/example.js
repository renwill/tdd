var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ExampleSchema = new Schema({
    test: 			String,
    datetime_gmt: 	Date
},{
    autoIndex: false
});

ExampleSchema.index({test:1});
ExampleSchema.index({datetime_gmt:1});

module.exports = mongoose.model('Example', ExampleSchema, 'Examples');