const hciEnum = require('../enum/hci');
const deviceEnum = require('../enum/device');

// 0B09493649412D343337303800000000000000000000000000000000
// 0B - 响应包长度，11字节
// 09493649412D3433373038 - 响应包内容
//     09 - 响应包类型，«Complete Local Name»
//     493649412D3433373038 - 设备name，I6IA-43708
function pack() {
  const deviceName = deviceEnum.DEVICE_NAME;
  let deviceNameBuffer = Buffer.from(deviceName);
  let payloadLength = hciEnum.AD_DATA_SIZE.TypeFieldSize + deviceNameBuffer.length;
  let buffer = Buffer.alloc(payloadLength + 1);
  let offset = 0;
  offset = buffer.writeUInt8(payloadLength, offset);
  offset = buffer.writeUInt8(hciEnum.AD_DATA_TYPE.CompleteLocalName, offset);
  offset = buffer.write(deviceName, offset);
  return buffer;
}

module.exports = {
  pack,
  pack,
};