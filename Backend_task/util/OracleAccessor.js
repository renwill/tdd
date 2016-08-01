var nconf 	= require('nconf');
var moment 	= require('moment');
var oracledb= require('oracledb');
var Promise = require('bluebird');
var logger 	= require('../util/Logger');

const rowFetchFromResultSetEachTime = 10;

var _pool;
const _pool_creating = '_pool_creating';
const retryGetPoolTimeMilliseconds = 1000;

var _connection;
const _connection_creating = '_connection_creating';
const retryGetConnectionTimeMilliseconds = 1000;

var _poolAttributes = {
    user          	: nconf.get('ODS_user'),
    password      	: nconf.get('ODS_password'),
    connectString 	: nconf.get('ODS_connectString'),
    poolMax			: 10000
};

// single _pool instance
function getPool(){
	return new Promise(function (resolve, reject){
		if (_pool) {
			if (_pool == _pool_creating){
				setTimeout(function() {
					getPool().then(function onResolved(pool){
						resolve(pool);
					},
					function onRejected(rejectedReason){
						reject(rejectedReason);
					});
				}, retryGetPoolTimeMilliseconds);
			}else{
				resolve(_pool);
			}
		} else {
			_pool = _pool_creating;
			_doCreatePool(_poolAttributes, function onCreatePoolCompleted(err, newPool) {
				if (err) {
					logger.error('Create pool error: ' + err.stack);
					_pool = null;
					reject(err);
				}
				else {
					_pool = newPool;
					resolve(_pool);
				}
			});
		}
	});	
}

function _doCreatePool(poolAttributes, callback){
	oracledb.createPool(poolAttributes, callback);
}

function terminatePool(){
	return new Promise(function (resolve, reject){
		_doTerminatePool(function onTerminatePoolCompleted(err, msg){
			if (err){
				reject(err);
			}
			else{
				_pool = null;
				resolve(msg);
			}
		});
	});
}

function _doTerminatePool(callback){
	if(_pool){
		if (_pool.connectionsInUse == 0){			
			_pool.terminate(callback);	
		}
		else{
			callback(new Error('Terminate pool error: You cannot kill me, I am still working'), null);
		}		
	}	
	else{
		// success
		callback(null, 'pool terminated');
	}
}

function _getConnection(){
	return new Promise(function (resolve, reject){		
		_doGetConnection(function onGetConnectionCompleted(err, connection){
			if (err){
				reject(err);
			}else{
				resolve(connection);
			}
		});		
	});
}

function _getConnectionOnce(){
	// single _connection instance
	return new Promise(function (resolve, reject){
		if (_connection) {
			if (_connection == _connection_creating){
				setTimeout(function() {
					_getConnectionOnce().then(function onResolved(connection){
								resolve(connection);
							},
							function onRejected(rejectedReason){
								reject(rejectedReason);
							});
				}, retryGetConnectionTimeMilliseconds);
			}else{
				resolve(_connection);
			}
		} else {
			_connection = _connection_creating;
			_getConnection().then(function onResolved(connection){
				_connection = connection;
				resolve(connection);
			},
			function onRejected(rejectedReason){
				_connection = null;
				reject(rejectedReason);
			});
		}
	});
}

function _doGetConnection(callback){	
	if (_pool && _pool != _pool_creating){
		_pool.getConnection(callback);
	}
	// auto create pool
	else{		
		//logger.info('No pool, auto creating pool');
		getPool().then(function onGetPoolResolved(pool){
			pool.getConnection(callback);
		},
		function onGetPoolRejected(rejectedReason){
			callback(rejectedReason, null);
		});		
	}
}

function _releaseConnection(connection){
	return new Promise(function (resolve, reject){
		_doReleaseConnection(
			connection,
			function onReleaseConnectionCompleted(err){
			if (err){
				reject(err);
			}
			else{
				resolve('connection released');
			}
		});
	});
}

function _releaseConnectionOnce(connection){
	// do nothing currently. don't know what to do yet
	return new Promise(function (resolve, reject){
		resolve('connection released');
	});
}

function releaseSharedConnection(){
	var connectionToClose = _connection;
	_connection = null;
	return _releaseConnection(connectionToClose);
}

function _doReleaseConnection(connection, callback){
	if (connection){
		connection.release(callback);	
	}
	else{
		callback(new Error('Release connection error: connection does not exist'));
	}
}

function _executeQuery(sql, bindParams, connection){
	return new Promise(function (resolve, reject){
		_doExecuteQuery(
			sql, 
			bindParams, 
			connection,
			function onExecuteCompleted(err, results){
			if (err) {
				logger.error('Execute query fail' + err.stack);
				reject(err);
			}
			else {
				resolve(results.rows);
			}
		});
	});
}

function _doExecuteQuery(sql, bindParams, connection, callback){
	if(connection){
		_preExecute(connection, function(err, msg){
			if (err){
				callback(err, null);
			}else{
				connection.execute(sql,
						bindParams,
						{ outFormat: oracledb.OBJECT },
						callback
				);
			}
		});
	}
	else{
		logger.error('connection does not exist');
		callback(new Error('Execute query error: connection does not exist'), null);
	}	
}

function executeQuery(sql, bindParams){
	return new Promise(function (resolve, reject){		
		_getConnection().then(function onGetConnectionResolved(connection){
			_executeQuery(sql, bindParams, connection).then(function onExecuteQueryResolved(results){
				_releaseConnection(connection).then(function onReleaseConnectionResolved(){
					resolve(results);
				}, function onReleaseConnectionRejected(rejectedReason){
					reject(rejectedReason);
				});				
			}, function onExecuteQueryRejected(rejectedReason){
				_releaseConnection(connection);
				reject(rejectedReason);
			});
		}, function onGetConnectionRejected(rejectedReason){
			reject(rejectedReason);
		});
	});
}


function executeQueryShareConnection(sql, bindParams){

	return new Promise(function (resolve, reject){
		_getConnectionOnce().then(function onGetConnectionResolved(connection){
			_executeQuery(sql, bindParams, connection).then(function onExecuteQueryResolved(results){
				_releaseConnectionOnce(connection).then(function onReleaseConnectionResolved(){
					resolve(results);
				}, function onReleaseConnectionRejected(rejectedReason){
					logger.error('release connection rejected' + rejectedReason.toString());
					reject(rejectedReason);
				});
			}, function onExecuteQueryRejected(rejectedReason){
				logger.error('execute querry rejected' + rejectedReason.toString());
				reject(rejectedReason);
			});
		}, function onGetConnectionRejected(rejectedReason){
			logger.error('get connection rejected' + rejectedReason.toString());
			reject(rejectedReason);
		});
	});
}

/**************************************************************
https://github.com/oracle/node-oracledb/blob/master/doc/api.md#resultsethandling

When the number of query rows is relatively big, or can't be predicted, 
it is recommended to use a ResultSet. 
This prevents query results being unexpectedly truncated by the maxRows limit
and removes the need to oversize maxRows to avoid such truncation. 

Otherwise, for queries that return a known small number of rows, 
non-result set queries may have less overhead.
**************************************************************/
function _executeQueryWithResultSet(sql, bindParams, connection){
	return new Promise(function (resolve, reject){
		_doExecuteQueryWithResultSet(
			sql, 
			bindParams, 
			connection,
			function onExecuteCompleted(err, result){
			if (err) {
				logger.error(err.stack);
				reject(err);
			}
			else {
				_fetchRowsFromResultSet(result.resultSet, 
					function onFetch(err, data){
						resolve(data);
				});
			}
		});
	});
}

function _doExecuteQueryWithResultSet(sql, bindParams, connection, callback){
	if(connection){
		_preExecute(connection, function(err, msg){
			if (err){
				callback(err, null);
			}else{
				connection.execute(sql,
						bindParams,
						{ resultSet: true, outFormat: oracledb.OBJECT },
						callback
				);
			}
		});
	}
	else{
		logger.error('connection does not exist');
		callback(new Error('Execute query error: connection does not exist'), null);
	}
}

function _fetchRowsFromResultSet(resultSet, callback){
	_r_fetchRowsFromResultSetToResultArray(resultSet, rowFetchFromResultSetEachTime, [], function onFecth(err, resultArray){
		callback(err, resultArray);
	});
}

// fetch result set and concat numRowsPerFetch rows to resultArray until end of result set
function _r_fetchRowsFromResultSetToResultArray(resultSet, numRowsPerFetch, resultArray, callback)
{
	resultSet.getRows(numRowsPerFetch, function onGetRow(err, rows){
		if (err){
			logger.error(err);
			closeResultSet(resultSet).then(function(){
				callback(err, null);
			}, function(rejected){
				callback(err, null);
			});
		// base case
		}else if (rows.length == 0){
			closeResultSet(resultSet).then(function(){
				callback(null, resultArray);
			}, function(rejected){
				callback(null, resultArray);
			});
		}else{
			resultArray = resultArray.concat(rows);
			_r_fetchRowsFromResultSetToResultArray(resultSet, numRowsPerFetch, resultArray, callback);
		}
	});
}

function executeQueryWithResultSet(sql, bindParams){
	return new Promise(function (resolve, reject){
		_getConnection().then(function onGetConnectionResolved(connection){
			_executeQueryWithResultSet(sql, bindParams, connection).then(function onExecuteQueryResolved(results){
				_releaseConnection(connection).then(function onReleaseConnectionResolved(){
					resolve(results);
				}, function onReleaseConnectionRejected(rejectedReason){
					logger.error('release connection rejected' + rejectedReason.toString());
					reject(rejectedReason);
				});				
			}, function onExecuteQueryRejected(rejectedReason){
				logger.error('execute querry rejected' + rejectedReason.toString());
				_releaseConnection(connection);
				reject(rejectedReason);
			});
		}, function onGetConnectionRejected(rejectedReason){
			logger.error('get connection rejected' + rejectedReason.toString());
			reject(rejectedReason);
		});
	});
}

function closeResultSet(resultSet){
	return new Promise(function(resolve, reject){
		resultSet.close(function onError(err){
			if (err){
				reject(err);
			}else{
				resolve('result set closed');
			}
		});
	});
}

function _preExecute(connection, nextAction){
	connection.execute("ALTER SESSION SET TIME_ZONE='00:00'", [], {}, nextAction);
}

/********************************************/
/*************** Export Object **************/
/********************************************/
module.exports = {
	terminatePool: terminatePool,
	executeQuery: executeQuery,
	getPool: getPool,
	executeQueryWithResultSet: executeQueryWithResultSet,
	executeQueryShareConnection: executeQueryShareConnection,
	releaseSharedConnection: releaseSharedConnection
};

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
	module.exports._private = {
		_pool: _pool,
		_poolAttributes: _poolAttributes,
		_doCreatePool: _doCreatePool,
		_doTerminatePool: _doTerminatePool,
		_getConnection: _getConnection,
		_getConnectionOnce: _getConnectionOnce,
		_doGetConnection: _doGetConnection,
		_releaseConnection: _releaseConnection,
		_releaseConnectionOnce: _releaseConnectionOnce,
		_doReleaseConnection: _doReleaseConnection,
		_executeQuery: _executeQuery,
		_doExecuteQuery: _doExecuteQuery,
		_executeQueryWithResultSet: _executeQueryWithResultSet,
		_doExecuteQueryWithResultSet: _doExecuteQueryWithResultSet,
		_fetchRowsFromResultSet: _fetchRowsFromResultSet,
		_preExecute: _preExecute
	};
}