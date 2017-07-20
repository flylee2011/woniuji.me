/**
 * @fileoverview 数据模型-梦想录模块
 * @author liyifei
 * @date 2017/07
 */
var db = require('../database/mysql');
var Collection = {};
var tableCollection = 'diary_collection';
var tableDiary = 'diary';

// 新增
Collection.insertItem = function(params, callback) {
    var sql = 'INSERT INTO ' + tableCollection + ' SET ?';
    var sqlParams = {
        uid: params.uid,
        cover_url: params.coverUrl,
        title: params.title,
        description: params.desc
    };

    db.query(sql, sqlParams, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

// 更新
Collection.updateItem = function(params, callback) {
    var sql = 'UPDATE ' + tableCollection + ' SET cover_url = ?, title = ?, description = ? WHERE id = ? AND uid = ?';
    var sqlParams = {
        id: params.id,
        uid: params.uid,
        cover_url: params.coverUrl,
        title: params.title,
        description: params.desc
    };

    db.query(sql, [sqlParams.cover_url, sqlParams.title, sqlParams.description, sqlParams.id, sqlParams.uid], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

// 删除，级联删除梦想录下的所有轨迹
Collection.delItem = function(params, callback) {
    var updateSet = 'UPDATE ' + tableCollection + ' , ' + tableDiary + ' SET ' + tableCollection + '.is_del = 1, ' + tableDiary + '.is_del = 1';
    var whereStr = ' WHERE ' + tableDiary + '.cid = ' + tableCollection + '.id ' + ' AND ' + tableCollection + '.id = ?' + ' AND ' + tableCollection + '.uid = ?';
    var sql = updateSet + whereStr;

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
Collection.getList = function(params, callback) {
    var sql = 'SELECT `id`, `cover_url`, `title`, `description` FROM ' + tableCollection;
    var sqlParams = {
        whereField: ' WHERE is_del = -1',
        order: params.order,
        rank: ' DESC ',
        limit: ((params.page - 1) * params.pageSize) + ',' + params.pageSize
    };
    if (params.uid) {
        sqlParams.whereField = sqlParams.whereField + ' AND uid = ' + params.uid;
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
Collection.getListCount = function(params, callback) {
    var sql = 'SELECT COUNT(*) AS count FROM ' + tableCollection;
    var sqlParams = {
        whereField: ' WHERE is_del = -1'
    };
    if (params.uid) {
        sqlParams.whereField = sqlParams.whereField + ' AND uid = ' + params.uid;
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

// 根据 id 获取详情
Collection.getDetail = function(params, callback) {
    var sql = 'SELECT `id`, `cover_url`, `title`, `description` FROM ' + tableCollection + ' WHERE is_del = -1 AND id = ?';
    var sqlParams = {
        id: params.id
    };

    db.query(sql, [sqlParams.id], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

module.exports = Collection;
