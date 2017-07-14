/**
 * @fileoverview 应用启动入口文件
 * @author liyifei<yifei@zoocer.com>
 * @date 2017/06
 */
var fs = require('fs');
// express
var express = require('express');
var bodyParser = require('body-parser');
// https
var https = require('https');
// 接口
var user = require('./routers/api/user');
var collection = require('./routers/api/collection');
var diary = require('./routers/api/diary');

// webpack
var webpack, webpackConfig, webpackDevMiddleware, webpackHotMiddleware, webpackCompiler;
// 中间件
// var browserSync = require('browser-sync').create();

// 判断运行环境，env=develop || env=production
var env = process.argv[2] || process.env.NODE_ENV;
var isDev = (env == 'develop') ? true : false;
// 静态文件目录
var staticDir = isDev ? './public/dev/' : './public/dist/';
// 监听端口号
var listenPort = isDev ? 8001 : 1426;
// 域名配置
var hostname = isDev ? 'local.woniuji.cn' : 'woniuji.cn';
// https 证书配置
var httpsOpt = {
    key: fs.readFileSync('./config/214174505710403.key'),
    cert: fs.readFileSync('./config/214174505710403.pem')
};

var app = express();

if (isDev) {
    // 开发环境中间件
    webpack = require('webpack');
    webpackConfig = require('./webpack.dev.js');
    webpackDevMiddleware = require('webpack-dev-middleware');
    webpackHotMiddleware = require('webpack-hot-middleware');
    webpackCompiler = webpack(webpackConfig);
    // webpack 开发环境
    app.use(webpackDevMiddleware(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }));
    // webpack 热替换
    app.use(webpackHotMiddleware(webpackCompiler));
}
// 解析 body
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// 路由
// 静态资源
app.use('/', express.static(staticDir));
// 接口
app.use('/api/user', user);
app.use('/api/collection', collection);
app.use('/api/diary', diary);

// 启动
var server;
if (isDev) {
    // 开发环境
    server = app.listen(listenPort, hostname, function() {
        console.log('Running on ' + hostname + ':' + server.address().port + ' for Development...');
    });
} else {
    // 生产环境
    server = app.listen(listenPort, hostname, function() {
        console.log('Running for Production...');
    });
}
// https.createServer(httpsOpt, app).listen(443);
