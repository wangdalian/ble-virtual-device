/**
 * 跨域处理中间件，配置允许跨域
 */

'use strict';

/**
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 中间件函数
 */
function handler(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    corsOtherProc(res);
    if (req.method === 'OPTIONS') return res.json();
    next();
}

/**
 * 公共跨域处理
 * @param res 请求响应
 */
function corsOtherProc(res) {
    // res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-token');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,PATCH,OPTIONS');
    res.header('X-Powered-By', ' 3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
}

module.exports = handler;