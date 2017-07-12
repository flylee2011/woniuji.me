/**
 * @fileoverview 数据模型-用户模块
 * @author liyifei
 * @date 2017/05
 */
var db = require('../database/mysql');
var User = {};
var tableName = 'user';

// 根据 openid 查询用户（微信）
User.getWxappUserByOpenid = function(params, callback) {
    var sql = 'SELECT `id`, `email`, `nickname`, `avatar`, `cover_url`, `gender`, `motto`, `score`, `plat`, `is_lock`, `create_time`, `update_time` FROM ' + tableName + ' WHERE wx_openid = ? AND is_del = -1 LIMIT 1';

    db.query(sql, [params.openid], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};
// 注册（微信）
User.regWxappUser = function(params, callback) {
    var sql = 'INSERT INTO ' + tableName + ' SET ?';
    params = {
        nickname: params.nickName,
        avatar: params.avatarUrl,
        gender: params.gender,
        wx_openid: params.openId,
        plat: 'weixin'
    };
    db.query(sql, params, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

// 获取列表
User.getList = function(params, callback) {
    var sql = 'SELECT `id`, `email`, `nickname`, `avatar`, `cover_url`, `gender`, `motto`, `score`, `plat`, `is_lock`, `create_time`, `update_time` FROM ' + tableName;
    var sqlParams = {
        whereField: ' WHERE is_del = -1',
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
// 获取列表总数
User.getListCount = function(params, callback) {
    var sql = 'SELECT COUNT(*) AS count FROM ' + tableName;
    var sqlParams = {
        whereField: ' WHERE is_del = -1'
    };
    sql = sql + sqlParams.whereField;

    db.query(sql, [], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, res);
    });
};

// 更新用户基础信息
User.updateUserinfo = function(params, callback) {
    var sql = 'UPDATE user SET username = ?, gender = ?, motto = ? WHERE id = ?';

    db.query(sql, [params.username, params.gender, params.motto, params.id], function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        callback(false, params);
    });
};

module.exports = User;
