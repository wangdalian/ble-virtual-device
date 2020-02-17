const _ = require('lodash');
const uuid = require('uuid');
const util = require('./util');
const logger = util.genModuleLogger(__filename);

const heartBeatFlag = 'keep-alive';
const heartBeatInterval = 60 * 1000;
const eventStreamHeader = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Transfer-Encoding': 'identity',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive'
};
const sseGroupMap = {};

function _setSseRequest(req) {
  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);
  req.on('close', function() {
    logger.warn('sse connect closed:', req.realIP);
  });
  return req;
}

function _setSseResponse(res) {
  res.statusCode = 200;
  res.set(eventStreamHeader);
  return res;
}

function createSseId(req, callback) {
  let sseId = uuid();
  sseGroupMap[sseId] = {};
  logger.info('create sse id ok:', sseId, req.realIP); // todo: 增加限制
  return setImmediate(callback, null, sseId);
}

function createById(sseId, req, res, callback) {
  if (!sseGroupMap[sseId]) {
    return setImmediate(callback, `no sseId: ${sseId}`, null);
  } else if (!_.isEmpty(sseGroupMap[sseId])) { // 已存在则不做处理
    logger.warn('sse already exist, do nothing:', sseId);
    return setImmediate(callback, null, null);
  }
  sseGroupMap[sseId] = {req: _setSseRequest(req), res: _setSseResponse(res)};
  logger.info('create sse by id ok:', sseId, req.realIP);
  return setImmediate(callback, null, null);
}

function destroyById(sseId) {
  if (!sseGroupMap[sseId]) {
    logger.warn('no sse:', sseId);
    return;
  }
  sseGroupMap[sseId].req && sseGroupMap[sseId].req.close();
  delete sseGroupMap[sseId];
  logger.info('destory sse ok:', sseId);
} 

function _sseEncode(objMessage) {
  let array = [];
  if (objMessage.event) array.push(`event: ${objMessage.event}`);
  if (objMessage.comment) array.push(`:${objMessage.comment}`);
  if (objMessage.id) array.push(`id: ${objMessage.id}`);
  if (objMessage.retry) array.push(`retry: ${objMessage.retry}`);
  if (objMessage.data) array.push(`data: ` + JSON.stringify(objMessage.data));
  return `${array.join('\n')}\n\n`;
}

function writeById(sseId, objMessage) {
  if (!sseGroupMap[sseId]) {
    logger.warn('no sse:', sseId);
    return;
  }
  let message = _sseEncode(objMessage);
  if (sseGroupMap[sseId].res) sseGroupMap[sseId].res.write(message);
  logger.debug('write sse message ok:', sseId, message);
}

function broadcast(objMessage) {
  logger.debug('sse broadcast message:', JSON.stringify(objMessage));
  let message = _sseEncode(objMessage);
  _.forEach(sseGroupMap, function(v, sseId) {
    v.res && v.res.write(message);
  });
}

function broadcastHeartbeat() {
  setInterval(broadcast, heartBeatInterval, {comment: heartBeatFlag});
}

function init() {
  logger.info('sse lib init start');
  broadcastHeartbeat();
  logger.info('sse lib init ok');
}

module.exports = {
  init,
  createById,
  destroyById,
  writeById,
  createSseId,
  broadcast,
  broadcastHeartbeat
};