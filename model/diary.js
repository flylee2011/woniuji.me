/**
 * @fileoverview 数据模型-日记模块
 * @author liyifei
 * @date 2017/07
 */
var db = require('../database/mysql');
var Diary = {};
var tableName = 'diary';

// 新增
Diary.insertItem = function(params, callback) {
    var sql = 'INSERT INTO ' + tableName + ' SET ?';
    var sqlParams = {
        uid: params.uid,
        cid: params.cid,
        img_url: params.imgUrl,
        content: params.content,
        like_count: 0,
        comment_count: 0
    };

    db.query(sql, sqlParams, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

// 删除
Diary.delItem = function(params, callback) {
    var sql = 'UPDATE ' + tableName + ' SET is_del = 1 WHERE id = ? AND uid = ?';
    var sqlParams = {
        id: params.id,
        uid: params.uid
    };

    db.query(sql, [sqlParams.id, sqlParams.uid], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

// 获取列表
Diary.getList = function(params, callback) {
    var sql = 'SELECT `id`, `img_url`, `content`, `like_count`, `comment_count` FROM ' + tableName;
    var sqlParams = {
        whereField: ' WHERE is_del = -1',
        order: params.order || 'like_count',
        limit: ((params.page - 1) * params.pageSize) + ',' + params.pageSize
    };
    if (params.uid) {
        sqlParams.whereField = sqlParams.whereField + ' AND uid = ' + params.uid;
    }
    if (params.cid) {
        sqlParams.whereField = sqlParams.whereField + ' AND cid = ' + params.cid;
    }
    sql = sql + sqlParams.whereField + ' ORDER BY ' + sqlParams.order + ' LIMIT ' + sqlParams.limit;

    db.query(sql, [], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

// 获取列表总数
Diary.getListCount = function(params, callback) {
    var sql = 'SELECT COUNT(*) AS count FROM ' + tableName;
    var sqlParams = {
        whereField: ' WHERE is_del = -1'
    };
    if (params.uid) {
        sqlParams.whereField = sqlParams.whereField + ' AND uid = ' + params.uid;
    }
    if (params.cid) {
        sqlParams.whereField = sqlParams.whereField + ' AND cid = ' + params.cid;
    }
    sql = sql + sqlParams.whereField;

    db.query(sql, [], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

module.exports = Diary;
