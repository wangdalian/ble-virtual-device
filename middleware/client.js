/**
 * 客户端信息处理中间件，用来收集客户端信息，如ip等
 */

'use strict';

/**
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 中间件函数
 */
function handler(req, res, next) {
    req.realIP = req.header('X-Real-IP') || req.ip;
    next();
}

module.exports = handler;