/**
 * 中间件调用过程
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('../lib/logger');
const corsMiddleware = require('./cros');
const errMiddleware = require('./error');
const routerMiddleware = require('./router');
const clientMiddleware = require('./client');

/**
 * 注册所有处理中间件
 * @param {Object} app
 */
function registerAll(app) {
    logger.info('middleware register all start');
    app.use(express.static('static'));                                  // 静态文件
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));  // 数据parser
    app.use(bodyParser.json({ limit: '10mb' }));                        // 数据parser
    app.use(bodyParser.raw({ limit: '10mb' }));                         // 数据parser
    app.all('*', clientMiddleware);                                     // 客户端信息
    app.all('*', corsMiddleware);                                       // 允许跨域
    routerMiddleware.register(app);                                     // 注册路由
    app.use(errMiddleware.error404);                                    // 404错误
    app.use(errMiddleware.error500);                                    // 500错误
    logger.info('middleware register all ok');
}

module.exports = {
    registerAll,
};