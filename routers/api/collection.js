/**
 * @fileoverview 接口-梦想录模块
 * @author liyifei
 * @date 2017/07
 */
var express = require('express');
var router = express.Router();
var globalConfig = require('../../config/global');

// api 返回 json
var getApiResJson = require('../../util/getApiResJson');
// 数据模型
var Collection = require('../../model/collection');

// 梦想录列表
// 登录用户列表
router.get('/mylist', function(req, res) {

});
// 所有列表，分页
router.get('/alllist', function(req, res) {

});
// 新增梦想录
router.post('/add', function(req, res) {
    var reqData = {
        coverUrl: req.body.coverUrl || '',
        title: req.body.title,
        desc: req.body.desc || ''
    };
    Collection.add(reqData, function(err, data) {

    });
});
// 更新梦想录
router.post('/update', function(req, res) {

});
// 删除梦想录
router.post('/del', function(req, res) {

});
