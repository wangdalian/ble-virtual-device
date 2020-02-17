const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);

// 数据包格式：Prefix(2B) + Header(1B) + Len(1B) + Data(NB)

// Prefix
const prefix = {
  WRITE: 0xff21, // 手机写入设备
  NOTIFY: 0xff23 // 设备上报手机
};

// Header
const header = {
  ALERT_ONE_MESSAGE: 0x31, // 提示单个信息
};

// 提示单个消息子类型, 1B
const messageType = {
  CALL: 0x01, // 来电
  SMS: 0x02, // 短信
  WEATHER: 0x03, // 天气
  PUSH: 0x04 // 推送
};

// 提示单个消息字体类型，1B
const messageFontType = {
  UNICODE: 0xff, // 消息内容unicode编码
};

// 处理prefix
const prefixHandler = {
  [prefix.WRITE]: prefixWriteHandler,
  [prefix.NOTIFY]: prefixNotifyHandler,
};

// 处理header
const headerHandler = {
  [header.ALERT_ONE_MESSAGE]: headerAlertOneMessageHandler,
};

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
function headerAlertOneMessageHandler(payloadBuffer) {
  let data = {type: 'ALERT_ONE_MESSAGE', data: {content: ''}};
  logger.info('header alert one message:', payloadBuffer.toString('hex'));
  const _messageType = payloadBuffer.readUInt8(0);
  const _fontType = payloadBuffer.readUInt8(1);
  if (_messageType === messageType.SMS && _fontType === messageFontType.UNICODE) {
    data.data.content = payloadBuffer.slice(2).toString();
    logger.info('alert one message:', data.data.content);
  } else {
    logger.warn('unsupport message type:', _messageType, _fontType);
  }
  return data;
}

function headerDefaultHandler(payloadBuffer) {
  logger.warn('header unsupport:', payloadBuffer);
  return {};
}

function prefixWriteHandler(payloadBuffer) {
  logger.info('prefix write:', payloadBuffer.toString('hex'));
  let header = payloadBuffer.readUInt8(0);
  let payload = payloadBuffer.slice(2);
  let handler = headerHandler[header] || headerDefaultHandler;
  return handler(payload);
}

function prefixNotifyHandler(payloadBuffer) {
  logger.info('prefix notify:', payloadBuffer.toString('hex'));
  // TODO: 处理子类型
  return {};
}

function prefixDefaultHandler(payloadBuffer) {
  logger.warn('unsupport prefix type:', prefix, payloadBuffer.toString('hex'));
  return {};
}

// 解析包缓存
let _parsePacketBuffer = null;

// return null: 解析未完成, 否则解析完成
function parsePacketData(dataBuffer) {
  let prefix = dataBuffer.readUInt16LE(0);

  // 检查是否首包，首包则直接缓存，非首包则追加缓存
  if (prefixHandler[prefix]) {
    _parsePacketBuffer = dataBuffer;
  } else {
    _parsePacketBuffer = Buffer.concat([_parsePacketBuffer, dataBuffer]);
  }

  // 检查是否接受完成了，未接收完成等待下个包，接收完成则处理包
  let realPayloadLength = dataBuffer.readUInt8(3);
  let thisPayloadLength = dataBuffer.length - 4;
  if (thisPayloadLength !== realPayloadLength) {
    return null;
  }
  let payloadBuffer = dataBuffer.slice(2);
  let handler = prefixHandler[prefix] || prefixDefaultHandler;
  return handler(payloadBuffer);
}

module.exports = {
  prefix,
  header,
  messageType,
  parsePacketData
};