const utils = require('../libs/util')
const dateTimeChar = require('../chars/dateTime')

// TODO: 抽象memory db，类似数据库的常用操作
const data = {
  uid: 0,
  dateTime: utils.charFieldsPack(dateTimeChar.fieldTypes, {}),
  msgList: [], // 保存的消息: {id: '消息id', categoryId: '消息类型', recvTime: '收到的时间', content: '消息内容',  hasRead: '是否已读'}
};

module.exports = {
  data
}