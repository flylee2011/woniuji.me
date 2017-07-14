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
var userModel = require('../../model/user');
// redis
var redisClient = require('../../database/redis');

/**
 * 微信登录，获取用户登录凭证
 * @param string code wx.login获得 required
 */
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
/**
 * 微信小程序，自动注册。没有该用户自动注册，有用户返回用户信息
 * @param string encryptedData 加密字段
 * @param string iv 加密字段
 * @param string sessionId 经过计算加密的登录 session 信息，用来验证登录状态
 */
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
        userModel.getWxappUserByOpenid({
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
                userModel.regWxappUser(deData, function(err, data) {
                    if (err) {
                        res.send(getApiResJson(500));
                    }
                    res.send(getApiResJson(200, {
                        id: data.insertId,
                        nickname: deData.nickName,
                        avatarUrl: deData.avatarUrl,
                        gender: deData.gender
                    }));
                });
            }
        });
    });
});

/**
 * 列表
 * @param int page 页码 默认1
 * @param int pageSize 每页条数 默认10
 * @param string order 排序字段 默认 update_time
 */
router.get('/list', function(req, res) {
    var reqData = {
        page: req.query.page || 1,
        pageSize: req.query.pageSize || globalConfig.api.pageSize,
        order: req.query.order || 'update_time'
    };
    var listData = [];
    var listCount = 0;
    // 操作数据模型
    userModel.getList(reqData, function(err, data) {
        if (err) {
            res.send(getApiResJson(500));
        }
        listData = data;
        userModel.getListCount(reqData, function(err, data) {
            if (err) {
                res.send(getApiResJson(500));
            }
            listCount = data;
            res.send(getApiResJson(200, {
                list: listData,
                total_count: listCount
            }));
        });
    });
});

/**
 * 根据 uid 获取用户信息
 * @param int uid 用户id required
 */
router.get('/get_userinfo', function(req, res) {
    var reqData = {
        uid: parseInt(req.query.uid)
    };
    // 检查参数
    if (!reqData.uid) {
        res.send(getApiResJson(400));
    }
    // 操作数据模型
    userModel.getUserInfoById(reqData, function(err, data) {
        if (err) {
            res.send(getApiResJson(500));
        }
        res.send(getApiResJson(200, data[0]));
    });
});

// // 更新用户基础信息
// router.post('/update_userinfo', multer().array(), function(req, res) {
//     var reqData = {
//         id: req.body.id,
//         username: req.body.username,
//         gender: req.body.gender,
//         motto: req.body.motto
//     };
//     userModel.updateUserinfo(reqData, function(err, data) {
//         if (err) {
//             apiResJson.data = err;
//         } else {
//             apiResJson.data = data;
//             apiResJson.code = 200;
//             apiResJson.message = 'success';
//         }
//         res.send(apiResJson);
//     });
// });

module.exports = router;
