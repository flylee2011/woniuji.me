/**
 * @fileoverview 接口-日记模块
 * @author liyifei
 * @date 2017/07
 */
var express = require('express');
var router = express.Router();

// 配置
var globalConfig = require('../../config/global');
// api 返回 json
var getApiResJson = require('../../util/getApiResJson');
// 数据模型
var diaryModel = require('../../model/diary');
// 检查登录状态
var checkLogin = require('../../util/checkLogin');

/**
 * 新增
 * @param int uid 用户id required
 * @param string sessionId 身份验证 required
 * @param int cid 梦想录id required
 * @param string imgUrl 图片url，多张用逗号分隔
 * @param string content 内容（图片和内容至少有一个字段是必填的）
 */
router.post('/add', function(req, res) {
    var reqData = {
        uid: parseInt(req.body.uid),
        cid: parseInt(req.body.cid),
        imgUrl: req.body.imgUrl,
        content: req.body.content
    };
    var sessionId = req.body.sessionId;
    // 检查参数
    if (!reqData.uid || !reqData.cid || !sessionId || (!reqData.imgUrl && !reqData.content)) {
        res.send(getApiResJson(400));
    }
    // 检查登录状态
    checkLogin(sessionId, function(code) {
        if (code != 200) {
            // 登录态失效
            res.send(getApiResJson(401));
        }
        // 操作数据模型
        diaryModel.insertItem(reqData, function(err, data) {
            if (err) {
                res.send(getApiResJson(500));
            }
            res.send(getApiResJson(200, {
                id: data.insertId
            }));
        });
    });
});

/**
 * 删除
 * @param int id 条目id required
 * @param int uid 用户id required
 * @param string sessionId 身份验证 required
 */
router.post('/del', function(req, res) {
    var reqData = {
        id: parseInt(req.body.id),
        uid: parseInt(req.body.uid)
    };
    var sessionId = req.body.sessionId;
    // 检查参数
    if (!reqData.id || !reqData.uid || !sessionId) {
        res.send(getApiResJson(400));
    }
    // 检查登录状态
    checkLogin(sessionId, function(code) {
        if (code != 200) {
            // 登录态失效
            res.send(getApiResJson(401));
        }
        // 操作数据模型
        diaryModel.delItem(reqData, function(err, data) {
            if (err) {
                res.send(getApiResJson(500));
            }
            res.send(getApiResJson(200, data));
        });
    });
});

/**
 * 列表（所有按某个字段排序、某个用户下的列表、某个梦想录下的列表）
 * @param int page 页码 默认1
 * @param int pageSize 每页条数 默认10
 * @param string order 排序字段 默认 like_count
 * @param int uid 用户id
 * @param int cid 梦想录id
 */
router.get('/list', function(req, res) {
    var reqData = {
        page: req.query.page || 1,
        pageSize: req.query.pageSize || globalConfig.api.pageSize,
        order: req.query.order || 'like_count',
        uid: parseInt(req.query.uid),
        cid: parseInt(req.query.cid)
    };
    var listData = [];
    var listCount = 0;
    // 操作数据模型
    diaryModel.getList(reqData, function(err, data) {
        if (err) {
            res.send(getApiResJson(500));
        }
        listData = data;
        diaryModel.getListCount(reqData, function(err, data) {
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
