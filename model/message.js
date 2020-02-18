/**
 * 消息内容
 */
const _ = require('lodash');
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
  let item = {content, recvTime: Date.now(), sender, hasRead: false, readTime: 0};
  message.push(item);
  let result = _.cloneDeep(item);
  result.index = message.length - 1;
  return result;
}

// 设置读取状态
function read(messageIndex) {
  if (!message[messageIndex]) {
    logger.warn('no message found:', messageIndex);
    return false;
  }
  message[messageIndex].hasRead = true;
  message[messageIndex].readTime = Date.now();
  return true;
}

// 获取未读消息条数
function hasUnread() {
  return _.filter(message, {hasRead: false}).length > 0;
}

module.exports = {
  save,
  read,
  hasUnread
};