'use strict';
var xml2js          = require('xml2js');
var logger          = require('../util/Logger');

// export the class
module.exports = {
        parseXml: function parseXml(p_xml, callback) {
            var parser = new xml2js.Parser({explicitArray: false});
            parser.parseString(p_xml, function parseString_CB(err, jdata) {
                if(err)
                    return callback(err);

                if (jdata != null) {

                    // manipulate data..........

                    callback(err,'return data');
                }else{
                    callback(new Error ('No shipment XML / invalid XML content from web service.'));
                }
            });
        }
    };


