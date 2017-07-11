/**
 * @fileoverview 数据模型-梦想录模块
 * @author liyifei
 * @date 2017/07
 */
var db = require('../database/mysql');
var Collection = {};
var tableName = 'diary_collection';

// 新增
Collection.insertItem = function(params, callback) {
    var sql = 'INSERT INTO ' + tableName + ' SET ?';
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
    var sql = 'UPDATE ' + tableName + ' SET cover_url = ?, title = ?, description = ? WHERE id = ? AND uid = ?';
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
// 删除
Collection.delItem = function(params, callback) {
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
Collection.getList = function(params, callback) {
    var sql = 'SELECT `id`, `cover_url`, `title`, `description` FROM ' + tableName;
    var sqlParams = {
        whereField: params.uid ? ' WHERE is_del = -1 AND uid = ' + params.uid : ' WHERE is_del = -1',
        order: params.order || 'update_time',
        limit: ((params.page - 1) * params.pageSize) + ',' + params.pageSize
    };
    sql = sql + sqlParams.whereField + ' ORDER BY ' + sqlParams.order + ' LIMIT ' + sqlParams.limit;

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
    var sql = 'SELECT `id`, `cover_url`, `title`, `description` FROM ' + tableName + ' WHERE is_del = -1 AND id = ?';
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
