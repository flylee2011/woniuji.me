/**
 * @fileoverview 检查登录状态
 * @author liyifei
 * @date 2017/07
 */
// redis
var redisClient = require('../../database/redis');

// 通过检查 sessionid 判断登录状态，用于需要登录权限的接口
var checkLogin = function(sessionId, callback) {
    if (!sessionId) {
        callback(500);
        return;
    }
    redisClient.get(sessionId, function(err, reply) {
        if (err || !reply) {
            callback(500);
        } else {
            callback(200);
        }
    });
};

module.exports = checkLogin;
