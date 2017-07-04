/**
 * @fileoverview 数据模型-用户模块
 * @author liyifei<yifei@zoocer.com>
 * @date 2017/05
 */
var db = require('../database/mysql');

var User = {};

// 根据 openid 查询用户（微信）
User.getWxappUserByOpenid = function(params, callback) {
    var sql = 'SELECT id,email,nickname,avatar,cover_url,gender,motto,score,plat,is_lock,update_time FROM user WHERE wx_openid = ? AND is_del = -1 limit 1';

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
    var sql = 'INSERT INTO user SET ?';
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

// // 获取微信用户
// User.getWxUser = function(params, callback) {
//     // type=2 是微信自动注册的用户
//     var sql = 'SELECT id, username FROM user WHERE username = ? AND type=2 limit 1';

//     db.query(sql, [params.username], function(err, res) {
//         if (err) {
//             callback(err);
//             return;
//         }
//         callback(false, res);
//     });
// };

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
