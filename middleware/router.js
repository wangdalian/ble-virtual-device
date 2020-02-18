'use strict';
const _ = require('lodash');
const feNotify = require('../router/fe_notify');
const message = require('../router/message');

/**
 * 各个模块根路由
 */
const routers = {
    '/api/fe-notify': feNotify,
    '/api/message': message
};

/**
 * 注册所有路由
 * @param app
 */
function register(app) {
    _.each(routers, function (action, path) {
        app.use(path, action);
    });
}

module.exports = {
    register
};