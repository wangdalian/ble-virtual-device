// 广播功率
const adPowerLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

const sendMsgType = {
  SIMPLE_ALERT: 0,
  // TODO: 以后需要再加...
}

// 定义SIG CHAR字段类型
function UINT8() {}
UINT8.prototype.length = 1;
UINT8.prototype.name = 'uint8';
UINT8.prototype.value = 0;

function UINT16() {}
UINT16.prototype.length = 2;
UINT16.prototype.name = 'uint16';
UINT16.prototype.value = 0;

// SIG定义的Char的字段类型
const charFormat = {
  UINT8: new UINT8(),
  UINT16: new UINT16(),
  // TODO: 其他的以后用到再加
}

const bandStatus = {
  INIT: 'init',
  AD: 'ad',
  CONNECT: 'connect'
}

module.exports = {
  adPowerLevel,
  charFormat,
  sendMsgType,
  bandStatus,
}