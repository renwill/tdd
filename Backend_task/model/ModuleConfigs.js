var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moduleConfigSchema = new Schema({
        module: {type: String, required: true},
        values: Schema.Types.Mixed
});
module.exports = mongoose.model('ModuleConfigs', moduleConfigSchema, 'ModuleConfigs');

