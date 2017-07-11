/**
 * @fileoverview redis 连接
 * @author liyifei
 * @date 2017/07
 */
var redis = require('redis');
var redisConfig = require('../config/redis');
redisConfig = redisConfig.develop;

// 创建连接
var client = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password
});

client.on('connect', function() {
    console.log('redis connect');
});
client.on('error', function(err) {
    console.log('redis error: ', err);
});

module.exports = client;
