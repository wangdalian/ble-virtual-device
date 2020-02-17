'use strict';

const error = require('./error');
const logger = require('./logger');

function json(code, msg, data) {
  return {code: code, msg: msg, data: data};
}

function res(res, code, msg, data, httpStatusCode) {
  res.status(httpStatusCode);
  return res.json(json(code, msg, data));
}

function res200(res, data) {
  res.status(200);
  data = data || {};
  return res.json(json(error.SUCCESS, 'success', data));
}

function res500(res, msg, code, data) {
  res.status(500);
  data = data || {};
  code = code || error.INTERNAL_ERR;
  msg = msg || 'server internal error';
  let jsonBody = json(code, msg, data);
  logger.warn(JSON.stringify(jsonBody));
  return res.json(jsonBody);
}

function res400(res, msg, code, data) {
  res.status(400);
  code = code || error.REQUEST_ERR;
  msg = msg || 'request error';
  let jsonBody = json(code, msg, data);
  logger.warn(JSON.stringify(jsonBody));
  return res.json(jsonBody);
}

function jsonParse(string) {
  try {
    return JSON.parse(string);
  } catch (ex) {
    logger.error('json parse error:', JSON.stringify(ex));
    return null;
  }
}

// 生成带模块名称的日志对象, TODO: 使用logger
function genModuleLogger(moduleFileName) {
  const moduleName = require('path').parse(moduleFileName).name;
  return {
    debug: console.log.bind(this, `[${moduleName}]`),
    info: console.log.bind(this, `[${moduleName}]`),
    warn: console.log.bind(this, `[${moduleName}]`),
    error: console.log.bind(this, `[${moduleName}]`)
  };
}

module.exports = {
  res,
  json,
  res200,
  res400,
  res500,
  jsonParse,
  genModuleLogger
};

