const enums = require('../libs/enum');
const utilLib = require('../libs/util')
const logLib = require('../modules/log')
const logger = logLib.genModuleLogger('iw02')

// 提供当前时间
const dateTimeChar = {
  uuid: '00002a08-0000-1000-8000-00805f9b34fb',
  properties: {
    read: true,
  },
  permission: {
    readable: true,
  }
}

// 消息通知
const sendMsgChar = {
  uuid: '0000ff21-0000-1000-8000-00805f9b34fb',
  properties: {
    write: true,
  },
  permission: {
    writeable: true,
  }
}

// 上报通知
const notifyChar = {
  uuid: '0000ff22-0000-1000-8000-00805f9b34fb',
  properties: {
    read: true,
    write: true,
    notify: true,
  },
  permission: {
    readable: true,
    writeable: true,
  }
}

const service = {
  uuid: '0000ff20-0000-1000-8000-00805f9b34fb',
  characteristics: [dateTimeChar, sendMsgChar, notifyChar]
};

const adParam = {
  advertiseRequest: {
    deviceName: 'WX VBAND',
    connectable: true,
    // serviceUuids: [service.uuid]
    serviceUuids: []
  },
  powerLevel: enums.adPowerLevel.HIGH
}

// 写请求消息解析器
// 短信消息格式：
//  不分包: 
//    21ff310302ff31
//      21ff -> prefix.WRITE
//      31 -> header.ALERT_ONE_MESSAGE
//      03 -> 载荷长度
//      02ff31 -> header.ALERT_ONE_MESSAGE的消息内容
//        02 -> messageType.SMS
//        ff -> messageFontType.UNICODE
//        31 -> 字符1
//  分包: 
//    21ff311602ff3131313131313131313131313131
//    313131313131
function sendMsgCharDataParser(value) {
  let result = {err: null, value: ''}
  const view = new Uint8Array(value)
  if (view[0] !== 0x21 || view[1] !== 0xff) result.err = 'invalid header'
  else if (view[2] !== 0x31) result.err = 'invalid cmd'
  // TODO: 1.增加分包支持 2.增加类型与长度校验
  else result.value = utilLib.uint8Array2Utf8(view.slice(6))
  logger.info('parsed send msg data:', result)
  return result
}

// 请求同步数据
// 配置参数：0200141414
//    0200 -> 命令标志
//    14 -> notify字节数
//    14 -> notify上报间隔
//    14 -> 指定上报条数，0为一直上报
// 开启同步: 0100
//    0100 -> 命令标志
// 关闭同步: 0000
//    0000 -> 命令标志
const notifyCmd = {
  CONF: 'sync',
  ON: 'on',
  OFF: 'off'
}
function notifyCharDataParser(_value) {
  let err = null
  let cmd = null
  let value = null
  // TODO: 增加大小端处理，命令占两个字节，小端
  const view = new Uint8Array(_value)
  if (view[0] === 0x00) { // 关闭通知
    cmd = notifyCmd.OFF
  } else if (view[0] === 0x01) { // 开启通知
    cmd = notifyCmd.ON
  } else if (view[0] === 0x02) { // 请求
    if (view.length >= 5) {
      cmd = notifyCmd.CONF
      value = {mtu: view[2], interval: view[3], count: view[4]}
    } else {
      err = 'notify cmd: invalid conf'
    }
  } else {
    err = 'unsupport notify cmd'
  }
  logger.info('parsed notify char data:', {err, cmd, value})
  return {err, cmd, value}
}

module.exports = {
  service,
  adParam,
  dateTimeChar,
  sendMsgChar,
  notifyChar,
  sendMsgCharDataParser,
  notifyCharDataParser,
  notifyCmd,
}