/**
 * @fileoverview 连接 mysql
 * @author liyifei
 * @date 2017/06
 */
var mysql = require('mysql');
var dbConfig = require('../config/database');
var pool = mysql.createPool(dbConfig.develop);

var query = function(sql, params, callback) {
    pool.getConnection(function(err, connection) {
        // query
        connection.query(sql, params, function(err, results) {
            callback(err, results);
            connection.release();
        });
    });
};

exports.query = query;
