const utils = require('../libs/util')
const dateTimeChar = require('../chars/dateTime')

// TODO: 抽象memory db，类似数据库的常用操作
const data = {
  uid: 0,
  
  peer: '', // 连接的对端

  dateTimeHex: utils.charFieldsPack(dateTimeChar.fieldTypes, {}),
  
  msgList: [], // 保存的消息: {id: '消息id', categoryId: '消息类型', recvTime: '收到的时间', content: '消息内容',  hasRead: '是否已读'}
  
  notifyBuffer: null, // notify上报的缓存数据包
  isNotifyOn: true, // notify是否开启
  notifyConf: { // 默认的notify上报配置
    mtu: 20, // 每条数据字节数
    interval: 200, // 上报间隔
    count: 0 // 上报条数，> 0上报完成后自动停止上报，=0一直上报
  }, 
  logsText: []
}

module.exports = {
  data
}