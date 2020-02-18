const sseLib = require('../lib/sse');
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);

const notifyType = {
  MESSAGE: 'message', // 收到了短信
  SCREEN_INFO: 'screenInfo' // 首屏信息
};

const feNotifySseList = [];

function getSse(req, res, callback) {
  sseLib.createSseId(req, function(err, sseId) {
    if (err) return callback(err, null);
    sseLib.createById(sseId, req, res, function(err) {
      if (err) return callback(err, null);
      feNotifySseList.push(sseId);
      return callback(null, null);
    });
  });
}

function broadcast(objMessage) {
  if (feNotifySseList.length > 0) logger.info('notify broadcast message:', JSON.stringify(objMessage), feNotifySseList.length);
  for (let index = 0; index < feNotifySseList.length; index++) {
    sseLib.writeById(feNotifySseList[index], objMessage);
  }
}

function bdMessage(_data) {
  const data = {type: notifyType.MESSAGE, data: _data};
  broadcast({data});
}

function bdScreenInfo(_data) {
  const data = {type: notifyType.SCREEN_INFO, data: _data};
  broadcast({data});
}

module.exports = {
  getSse,
  broadcast,
  notifyType,
  bdMessage,
  bdScreenInfo
};