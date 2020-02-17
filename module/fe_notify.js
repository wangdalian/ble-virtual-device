const sseLib = require('../lib/sse');
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);

const notifyType = {
  MESSAGE: 'message', // 收到了短信
};

const notifySseList = [];

function getSse(req, res, callback) {
  sseLib.createSseId(req, function(err, sseId) {
    if (err) return callback(err, null);
    sseLib.createById(sseId, req, res, function(err) {
      if (err) return callback(err, null);
      notifySseList.push(sseId);
      return callback(null, null);
    });
  });
}

function broadcast(objMessage) {
  logger.info('notify broadcast message:', JSON.stringify(objMessage), notifySseList.length);
  for (let index = 0; index < notifySseList.length; index++) {
    sseLib.writeById(notifySseList[index], objMessage);
  }
}

function bdMessage(_data) {
  logger.info('notify message:', JSON.stringify(_data));
  const data = {type: notifyType.MESSAGE, data: _data};
  broadcast({data});
}

module.exports = {
  getSse,
  broadcast,
  notifyType,
  bdMessage,
};