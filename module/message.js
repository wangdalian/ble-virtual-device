const messageModel = require('../model/message');

// 设置短信已读状态
function setReadStatus(messageIndex, callback) {
  let result = messageModel.read(messageIndex);
  if (!result) return callback('invalid message index');
  return callback(null, null);
}

module.exports = {
  setReadStatus
};