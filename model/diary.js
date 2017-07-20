/**
 * @fileoverview 数据模型-日记模块
 * @author liyifei
 * @date 2017/07
 */
var db = require('../database/mysql');
var Diary = {};
var tableDiary = 'diary';
var tableUser = 'user';
var tableCollection = 'diary_collection';

// 新增
Diary.insertItem = function(params, callback) {
    var sql = 'INSERT INTO ' + tableDiary + ' SET ?';
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
    var sql = 'UPDATE ' + tableDiary + ' SET is_del = 1 WHERE id = ? AND uid = ?';
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
    // 连表查询
    var selectStr = 'SELECT ' + tableDiary + '.*, ' + tableUser + '.nickname, ' + tableUser + '.avatar_url, ' + tableCollection + '.title AS collection_title';
    var innerJoin1 = ' INNER JOIN ' + tableUser + ' ON ' + tableDiary + '.uid = ' + tableUser + '.id';
    var innerJoin2 = ' INNER JOIN ' + tableCollection + ' ON ' + tableDiary + '.cid = ' + tableCollection + '.id';
    var sql = selectStr + ' FROM ' + tableDiary + innerJoin1 + innerJoin2;

    var sqlParams = {
        whereField: ' WHERE `diary`.is_del = -1',
        order: '`diary`.' + params.order,
        rank: ' DESC ',
        limit: ((params.page - 1) * params.pageSize) + ',' + params.pageSize
    };
    if (params.uid) {
        sqlParams.whereField = sqlParams.whereField + ' AND `diary`.uid = ' + params.uid;
    }
    if (params.cid) {
        sqlParams.whereField = sqlParams.whereField + ' AND `diary`.cid = ' + params.cid;
    }
    sql = sql + sqlParams.whereField + ' ORDER BY ' + sqlParams.order + sqlParams.rank + ' LIMIT ' + sqlParams.limit;

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
    var sql = 'SELECT COUNT(*) AS count FROM ' + tableDiary;
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
