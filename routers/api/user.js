/**
 * @fileoverview 接口路由-用户模块
 * @author liyifei
 * @date 2017/06
 */
var express = require('express');
var router = express.Router();
var md5 = require('md5');
var multer = require('multer');
var User = require('../../model/user');
var request = require('request');
var globalConfig = require('../../config/global');
var WXBizDataCrypt = require('../../util/WXBizDataCrypt');

// api 返回 json
var apiResJson = globalConfig.apiResJson;
var getApiResJson = require('../../util/getApiResJson');

// 微信登录，获取用户登录凭证
router.get('/user/wxapp_login', function(req, res) {
    // 接收参数，wx.login 获得的 code
    var code = req.query.code;
    // 参数判断
    if (!code) {
        apiResJson = getApiResJson(401);
        res.send(apiResJson);
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
        // session
        // var sessionId = md5(body.session_key + body.openid);
        // var sessionValue = body.session_key + body.openid;

        if (!error && body.openid && body.session_key) {
            apiResJson = getApiResJson(200, {
                'third_session': body.session_key
            });
        }
        res.send(apiResJson);
    });
});
// 微信小程序，自动注册
router.get('/user/wxapp_autoreg', function(req, res) {
    // 接收参数
    var encryptedData = req.query.encryptedData;
    var iv = req.query.iv;
    var sessionKey = req.query.thirdSession;
    var appid = globalConfig.wxapp.appid;
    // 解密数据
    var pc = new WXBizDataCrypt(appid, sessionKey);
    var deData = pc.decryptData(encryptedData, iv);

    // 检查是否有这个用户
    User.getWxappUserByOpenid({
        openid: deData.openId
    }, function(err, data) {
        if (!err) {
            if (data.length) {
                // 有这个用户，返回用户信息
                apiResJson = getApiResJson(200, data[0]);
                res.send(apiResJson);
            } else {
                // 没有这个用户，自动注册
                User.regWxappUser(deData, function(err, data) {
                    if (!err) {
                        apiResJson = getApiResJson(200, {
                            id: data.insertId,
                            nickname: deData.nickName,
                            avatar: deData.avatarUrl,
                            gender: deData.gender
                        });
                    }
                    res.send(apiResJson);
                });
            }
        } else {
            res.send(apiResJson);
        }
    });
});

// 更新用户基础信息
router.post('/user/update_userinfo', multer().array(), function(req, res) {
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
