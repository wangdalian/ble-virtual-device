const hciEnum = require('../enum/hci');
const logger = require('../lib/logger');

let manufacturerSpecificData = {
  step: 0x112233, // 3字节，小端
  calorie: 0x4455, // 2字节
  heartrate: 0x66, // 1字节，小端
  battery: 0x16, // 1字节
  sportType: 0x01, // 1字节
  mac: null // 6字节
};
const manufacturerSpecificDataLen = 14;

// 广播包中的flag，格式：长度1B + 类型1B + 数据
function _adDataPackFlags(buffer, offset) {
  const payloadLength = hciEnum.AD_DATA_SIZE.TypeFieldSize + hciEnum.AD_DATA_SIZE.FlagsParamSize;
  offset = buffer.writeUInt8(payloadLength, offset);
  offset = buffer.writeUInt8(hciEnum.AD_DATA_TYPE.Flags, offset);
  offset = buffer.writeUInt8(hciEnum.AD_DATA_FLAGS.LEGeneralDiscoverableMode | hciEnum.AD_DATA_FLAGS.BREDRNotSupported, offset);
  return offset;
}

// 广播包中的16bit uuids，格式：长度1B + 类型1B + 数据
function _adDataPack16UUIDs(buffer, uuids, offset) {
  const payloadLength = hciEnum.AD_DATA_SIZE.TypeFieldSize + uuids.length * 2;
  offset = buffer.writeUInt8(payloadLength, offset);
  offset = buffer.writeUInt8(hciEnum.AD_DATA_TYPE.IncompleteListOf16BitServiceClassUUIDs, offset);
  for (let index = 0; index < uuids.length; index++) {
    offset = buffer.writeUInt16LE(parseInt(uuids[index], 16), offset);
  }
  return offset;
}

// 广播包中的自定义数据，格式：长度1B + 类型1B + 数据
function _adDataPackData(buffer, data, offset) {
  offset = buffer.writeUInt8(manufacturerSpecificDataLen + hciEnum.AD_DATA_SIZE.TypeFieldSize, offset);
  offset = buffer.writeUInt8(hciEnum.AD_DATA_TYPE.ManufacturerSpecificData, offset);
  offset = buffer.writeUInt8(data.step & 0x0000ff, offset);
  offset = buffer.writeUInt8((data.step & 0x00ff00) >> 8, offset);
  offset = buffer.writeUInt8((data.step & 0xff0000) >> 16, offset);
  offset = buffer.writeUInt16LE(data.calorie, offset);
  offset = buffer.writeUInt8(data.heartrate, offset);
  offset = buffer.writeUInt8(data.battery, offset);
  offset = buffer.writeUInt8(data.sportType, offset);
  offset = buffer.writeUInt8(0x00, offset); // ??不清楚啥作用??
  if (!data.mac) {
    data.mac = require('bleno').address.replace(/:/g, '');
    logger.info('device mac:', data.mac);
  }
  offset += buffer.write(data.mac, offset, 'hex');
  return offset;
}

// 埃微手环的广播包为例
// 0201060702F5FEE7FE20FF10FF 000000000043220100 C0005BD1AABC 000000
// step: [13,14,15]
// calorie: [16, 17]
// heartrate: [18]
// battery:[19]
// sportType: [20]
function pack(uuids) {
  let buffer = Buffer.alloc(31);
  let offset = 0;
  offset = _adDataPackFlags(buffer, offset);
  offset = _adDataPack16UUIDs(buffer, uuids, offset);
  offset = _adDataPackData(buffer, manufacturerSpecificData, offset);
  return buffer;
}

module.exports = {
  pack,
};