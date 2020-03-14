const enums = require('../libs/enum');
const utilLib = require('../libs/util')
const logger = require('../libs/log')

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
  value: new ArrayBuffer(20),
  properties: {
    read: true,
    write: true,
  },
  permission: {
    readable: true,
    writeable: true,
  }
}

const service = {
  uuid: '0000ff20-0000-1000-8000-00805f9b34fb',
  characteristics: [dateTimeChar, sendMsgChar]
};

const adParam = {
  advertiseRequest: {
    deviceName: 'WX VBAND',
    connectable: true,
    serviceUuids: [service.uuid]
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
  else result.value = utilLib.uint8Array2Utf8(view.slice(6))
  logger.info('parsed send msg data:', result)
  return result
}

module.exports = {
  service,
  adParam,
  dateTimeChar,
  sendMsgChar,
  sendMsgCharDataParser
}