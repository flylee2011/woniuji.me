/**
 * @fileoverview 接口路由-用户模块
 * @author liyifei
 * @date 2017/06
 */
var express = require('express');
var router = express.Router();
// var md5 = require('md5');
var multer = require('multer');
var User = require('../../model/user');

// 返回 json
var resJson = {
    code: 500,
    data: null,
    message: 'system error'
};

// 自动注册
router.get('/user/auto_reg', function(req, res) {
    // var reqData = {
    //     username: req.body.username,
    //     password: md5(req.body.password)
    // };
    User.autoReg({}, function(err, data) {
        if (err) {
            resJson.data = err;
        } else if (data.affectedRows > 0) {
            resJson.code = 200;
            resJson.data = {
                insertId: data.insertId
            };
            resJson.message = 'success';
        }
        res.send(resJson);
    });
});

// 获取微信用户
router.get('/user/get_wxuser', function(req, res) {
    var reqData = {
        username: req.query.username
    };
    User.getWxUser(reqData, function(err, data) {
        if (err) {
            resJson.data = err;
        } else {
            resJson.data = data[0] || null;
            resJson.code = 200;
            resJson.message = 'success';
        }
        res.send(resJson);
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
            resJson.data = err;
        } else {
            resJson.data = data;
            resJson.code = 200;
            resJson.message = 'success';
        }
        res.send(resJson);
    });
});

module.exports = router;
