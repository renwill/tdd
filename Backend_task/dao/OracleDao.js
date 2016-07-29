'use strict';
var _               = require('lodash');
var cmnUtil         = require('../util/cmnUtil');
var logger          = require('../util/Logger');
var OracleAccessor  = require('../util/OracleAccessor');

function _getOracleData(p_sql,callback){
    OracleAccessor.executeQueryWithResultSet(p_sql, []).then(function onPromiseResolved(results) {
        callback(null,results);
    }, function onOracleAccessorPromiseRejected(rejectReason) {
        logger.error('Oracle SQL execution rejected: ' + rejectReason.toString());
        callback('Get ODS Ports rejected: ' + rejectReason.toString(), null);
    });
}

function _genQueryProjection(p_projectionConfig){
    var projection = [];
    Object.keys(p_projectionConfig).forEach(function(key){
        projection.push('{1} AS RESULT{0} '.format(key,p_projectionConfig[key]));
    });
    return(_.values(projection).join(','));
}

function getSchedule(p_dsm_obj,p_mConfig,callback) {
    try{
        var config = p_mConfig.ODS_config_ITS_schedule;
        var vObj = p_dsm_obj.voy;
        if(vObj!= null){
            // with single query
            var tODSSQL = "SELECT {0} , SCH_STATE AS RSTATE FROM its_schedule_rvw WHERE svc_loop_abbrv = '{2}' AND vsl_cde = '{3}' AND voy_num = '{4}' AND dir_bound = '{5}' AND call_num = {6} AND SCH_STATE IN ('{1}') AND FCIL_CDE IN (select GSP_FCIL_CDE from GSP_FACILITY_RVW gfr join GSP_PORT_RVW gpr on gfr.GSP_PORT_NME = gpr.GSP_PORT_NME where gpr.ods_port_cde = '{7}')"
                .format(
                _genQueryProjection(config['berth_field']),
                _.values(config['berth_condition']).join("','"),
                vObj.svc_loop,
                vObj.vsl_cde,
                vObj.voy_num,
                vObj.dir_bound,
                vObj.call_num,
                vObj.call_port
            );

            _getOracleData(tODSSQL,function(err,results){
                callback(err,results);
            });
        }else{
            callback(new Error('no voyage info for the obj'));
        }
    }catch(err){
        callback(err);
    }
}

function cleanUp(callback){
logger.info('test oracle clean up');
    OracleAccessor.releaseSharedConnection().then(function resolved(){
        callback(null, 'clean up completed');
    }, function rejected(err){
        if (err.message == 'Release connection error: connection does not exist'){
            callback(null, 'connection does not exist');
        }else{
            callback(err, 'cannot clean up');
        }
    });
}

// export the class
module.exports = {
    // public methods
    getSchedule : getSchedule,
    cleanUp     : cleanUp
};

if (process.env.NODE_ENV === 'test') {
    module.exports._private = {
        // private methods
        _getOracleData : _getOracleData
    }
}


