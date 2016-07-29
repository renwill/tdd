module.exports = {
	dbUrl: 			'mongodb://localhost:27017/ccsn',
	logPath: 		'./logs/',
	
	retryInterval:		5000,
	jobInterval:       2000,
	dbConnectTimeoutMS: 10000,

	// Backend Monitor
	expectedExecutionTime: 2*60*1000,
	
	ODS_config_ITS_schedule : {
		'berth_field' : {
			'I' : 'BERTH_ARR_DT_GMT',
			'O' : 'BERTH_DEP_DT_GMT'
		},
		'berth_condition' : {
			'ET': 'coastal',
			'AT': 'actual'
		}
	},

	// For ODS oracle DB connection
	ODS_user          : 'GLOBAL_SUPP',
	ODS_password      : 'GLOBAL_SUPP',
	// For information on connection strings see:
	// https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connectionstrings
	ODS_connectString : '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=hkir2nppm.oocl.com)(PORT=1521))(LOAD_BALANCE=yes)(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=irnppm.oocl)))'  // Easy Connect syntax

};