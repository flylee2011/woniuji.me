/**
 * @fileoverview 应用启动入口文件
 * @author liyifei<yifei@zoocer.com>
 * @date 2017/06
 */
// express
var express = require('express');
var bodyParser = require('body-parser');

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
var hostname = isDev ? 'local.woniuji.me' : 'woniuji.me';

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// 路由
// 静态资源
app.use('/', express.static(staticDir));

// 启动
var server;
if (isDev) {
    // 开发环境
    server = app.listen(listenPort, hostname, function() {
        // browserSync.init({
        //     open: false,
        //     // ui: false,
        //     notify: false,
        //     proxy: 'localhost:8001',
        //     files: [staticDir + '*.html'],
        //     port: 8002
        // });
        console.log('Running on ' + hostname + ':' + server.address().port + ' for Development...');
    });
} else {
    // 生产环境
    server = app.listen(listenPort, hostname, function() {
        console.log('Running for Production...');
    });
}
