/**
 * 标准http请求错误处理中间件，注意404一定在500错误之前注册
 */
'use strict';

const utils = require('../lib/util');
const error = require('../lib/error');

/**
 * 404错误处理函数
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 中间件函数
 */
function error404(req, res, next) {
    const errMsg = {
        ip: req.ip,
        msg: 'IN uri error: ' + req.originalUrl,
        logLevel: 'error'
    };
    return utils.res(res, error.REQUEST_ERR, 'not found', errMsg, 404);
}

/**
 * 500错误处理
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 中间件函数
 */
function error500(err, req, res, next) {
    res.status(err.status || 500);
    const errMsg = {
        ip: req.ip,
        msg: 'IN uri error: ' + req.originalUrl,
        logLevel: 'error'
    };
    errMsg.errStack = err.stack || err;
    return utils.res500(res, 'intertal error', error.INTERNAL_ERR, errMsg);
}

module.exports = {
    error404,
    error500
};