/**
 * 消息内容
 */
const config = require('config');
const utils = require('../lib/util');

const messageConf = config.get('message');
const logger = utils.genModuleLogger(__filename);

const message = [];

// 保存消息
function save(content, sender) {
  if (message.length > messageConf.capacity) {
    let removed = message.shift();
    logger.warn('reach max capacity, remove the oldest:', removed);
  }
  message.push({content, recvTime: Date.now(), sender, hasRead: false, readTime: 0});
  return message.length - 1;
}

// 设置读取状态
function read(messageIndex) {
  if (!message[messageIndex]) {
    logger.warn('no message found:', messageIndex);
    return;
  }
  message[messageIndex].hasRead = true;
  message[messageIndex].readTime = Date.now();
}

module.exports = {
  save,
  read,
};