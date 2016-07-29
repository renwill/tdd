/**
 * Created by MAOLY on 1/29/2016.
 */
var env = 'env';
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
    env = process.env.NODE_ENV;
}
module.exports = require('./env/' + env + '.js');
