/**
 * @fileoverview 接口-梦想录模块
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
var Collection = require('../../model/collection');
// redis
var redisClient = require('../../database/redis');

/**
 * 新增梦想录
 * @param int uid 用户id required
 * @param string sessionId 身份验证 required
 * @param string title 标题 required
 * @param string coverUrl 封面图url
 * @param string desc 描述
 */
router.post('/add', function(req, res) {
    var reqData = {
        uid: parseInt(req.body.uid),
        title: req.body.title,
        coverUrl: req.body.coverUrl || '',
        desc: req.body.desc || ''
    };
    var sessionId = req.body.sessionId;
    // 检查参数
    if (!reqData.uid || !reqData.title || !sessionId) {
        res.send(getApiResJson(400));
    }
    // 检查 session
    redisClient.get(sessionId, function(err, reply) {
        if (err || !reply) {
            res.send(getApiResJson(401));
        }
        Collection.insertItem(reqData, function(err, data) {
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
 * 更新梦想录
 * @param int id 条目id required
 * @param int uid 用户id required
 * @param string sessionId 身份验证 required
 * @param string title 标题 required
 * @param string coverUrl 封面图url
 * @param string desc 描述
 */
router.post('/update', function(req, res) {
    var reqData = {
        id: parseInt(req.body.id),
        uid: parseInt(req.body.uid),
        title: req.body.title,
        coverUrl: req.body.coverUrl,
        desc: req.body.desc
    };
    var sessionId = req.body.sessionId;
    // 检查参数
    if (!reqData.id || !reqData.uid || !reqData.title || !reqData.coverUrl || !reqData.desc || !sessionId) {
        res.send(getApiResJson(400));
    }
    // 检查 session
    redisClient.get(sessionId, function(err, reply) {
        if (err || !reply) {
            res.send(getApiResJson(401));
        }
        Collection.updateItem(reqData, function(err, data) {
            if (err) {
                res.send(getApiResJson(500));
            }
            res.send(getApiResJson(200, data));
        });
    });
});
/**
 * 删除梦想录
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
    if (!reqData.id || !reqData.uid) {
        res.send(getApiResJson(400));
    }
    // 检查 session
    redisClient.get(sessionId, function(err, reply) {
        if (err || !reply) {
            res.send(getApiResJson(401));
        }
        Collection.delItem(reqData, function(err, data) {
            if (err) {
                res.send(getApiResJson(500));
            }
            res.send(getApiResJson(200, data));
        });
    });
});
/**
 * 梦想录列表
 * @param int page 页码 默认1
 * @param int pageSize 每页条数 默认10
 * @param string order 排序字段 默认 update_time
 * @param int uid 用户id
 */
router.get('/list', function(req, res) {
    var reqData = {
        page: req.query.page || 1,
        pageSize: req.query.pageSize || globalConfig.api.pageSize,
        order: req.query.order || 'update_time',
        uid: parseInt(req.query.uid)
    };
    Collection.getList(reqData, function(err, data) {
        if (err) {
            res.send(getApiResJson(500));
        }
        res.send(getApiResJson(200, data));
    });
});
/**
 * 梦想录详情
 * @param int id 条目id required
 */
router.get('/detail', function(req, res) {
    var reqData = {
        id: parseInt(req.query.id)
    };
    // 检查参数
    if (!reqData.id) {
        res.send(getApiResJson(400));
    }
    Collection.getDetail(reqData, function(err, data) {
        if (err) {
            res.send(getApiResJson(500));
        }
        res.send(getApiResJson(200, data[0] || null));
    });
});

module.exports = router;
