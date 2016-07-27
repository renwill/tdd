exports.sendJson =function(res, data)
{
    //send a successful json result back
    //console.log(data);
    res.json({success: true, data: data});
};

exports.sendErr = function(res, err)
{
    //send back a failure result
    appLogger.error(err);
    res.json({success: false, data: err});
};