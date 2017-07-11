/**
 * @fileoverview 接口路由-用户模块
 * @author liyifei
 * @date 2017/06
 */
var express = require('express');
var router = express.Router();
var md5 = require('md5');
var multer = require('multer');
var request = require('request');

// 配置
var globalConfig = require('../../config/global');
// 微信解密算法
var WXBizDataCrypt = require('../../util/WXBizDataCrypt');
// api 返回 json
var getApiResJson = require('../../util/getApiResJson');
// 数据模型
var User = require('../../model/user');
// redis
var redisClient = require('../../database/redis');

// 微信登录，获取用户登录凭证
router.get('/wxapp_login', function(req, res) {
    // 接收参数，wx.login 获得的 code
    var code = req.query.code;
    // 参数判断
    if (!code) {
        res.send(getApiResJson(400));
    }

    // 参数
    var wxLoginApi = globalConfig.wxapp.loginApi;
    var appid = globalConfig.wxapp.appid;
    var secret = globalConfig.wxapp.secret;
    // 请求微信服务器获取 session
    var reqOption = {
        method: 'GET',
        url: wxLoginApi,
        json: true,
        qs: {
            appid: appid,
            secret: secret,
            js_code: code,
            grant_type: 'authorization_code'
        }
    };
    request(reqOption, function(error, response, body) {
        if (error) {
            res.send(getApiResJson(500));
        }
        // 加密 session 信息
        var sessionId = 'sessionid:' + md5(body.session_key + body.openid);
        var sessionValue = body.session_key + '|' + body.openid;
        // 存储 session 信息到 redis
        redisClient.set(sessionId, sessionValue, function(err, reply) {
            if (err) {
                res.send(getApiResJson(500));
            }
            if (body.openid && body.session_key) {
                res.send(getApiResJson(200, {
                    'sessionId': sessionId
                }));
            }
        });
    });
});
// 微信小程序，自动注册
router.get('/wxapp_autoreg', function(req, res) {
    // 接收参数
    var encryptedData = req.query.encryptedData;
    var iv = req.query.iv;
    var sessionId = req.query.sessionId;
    // 解密参数
    var appid = globalConfig.wxapp.appid;
    var sessionKey = '';
    var pc = '';
    var deData = {};
    // 通过 sessionid 获取 sessionkey
    redisClient.get(sessionId, function(err, reply) {
        if (err || !reply) {
            res.send(getApiResJson(401));
        }

        // 解密数据
        sessionKey = reply.split('|')[0];
        pc = new WXBizDataCrypt(appid, sessionKey);
        deData = pc.decryptData(encryptedData, iv);

        // 检查是否有这个用户
        User.getWxappUserByOpenid({
            openid: deData.openId
        }, function(err, data) {
            if (err) {
                res.send(getApiResJson(500));
            }
            if (data.length) {
                // 有这个用户，返回用户信息
                res.send(getApiResJson(200, data[0]));
            } else {
                // 没有这个用户，自动注册
                User.regWxappUser(deData, function(err, data) {
                    if (err) {
                        res.send(getApiResJson(500));
                    }
                    res.send(getApiResJson(200, {
                        id: data.insertId,
                        nickname: deData.nickName,
                        avatar: deData.avatarUrl,
                        gender: deData.gender
                    }));
                });
            }
        });
    });
});

// 更新用户基础信息
router.post('/update_userinfo', multer().array(), function(req, res) {
    var reqData = {
        id: req.body.id,
        username: req.body.username,
        gender: req.body.gender,
        motto: req.body.motto
    };
    User.updateUserinfo(reqData, function(err, data) {
        if (err) {
            apiResJson.data = err;
        } else {
            apiResJson.data = data;
            apiResJson.code = 200;
            apiResJson.message = 'success';
        }
        res.send(apiResJson);
    });
});

module.exports = router;
