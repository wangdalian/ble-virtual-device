
const util = require('util');
const bleno = require('bleno');
const logger = require('../../lib/util').genModuleLogger(__filename);
const BlenoCharacteristic = bleno.Characteristic;

const uuid = '2a04';

// 具体定义参考：https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.gap.peripheral_preferred_connection_parameters.xml
const data = {
  MinimumConnectionInterval: 0x0030, // uint16
  MaximumConnectionInterval: 0x0050, // uint16
  SlaveLatency: 0x0002, // uint16
  ConnectionSupervisionTimeoutMultiplier: 0x0258// uint16
};

// value 3000500002005802
// TODO: 这些值对应的控制slave的命令是什么？是否需要下发命令？
function data2Buffer(data) {
  let buffer = Buffer.alloc(8);
  let offset = buffer.writeUInt16LE(data.MinimumConnectionInterval, 0);
  offset = buffer.writeUInt16LE(data.MaximumConnectionInterval, offset);
  offset = buffer.writeUInt16LE(data.SlaveLatency, offset);
  offset = buffer.writeUInt16LE(data.ConnectionSupervisionTimeoutMultiplier, offset);
  return buffer;
}

const PeripheralPreferredConnectionParametersCharacteristic = function() {
  PeripheralPreferredConnectionParametersCharacteristic.super_.call(this, {
    uuid: uuid,
    properties: ['read']
  });
  this._value = data2Buffer(data);
};

util.inherits(PeripheralPreferredConnectionParametersCharacteristic, BlenoCharacteristic);

PeripheralPreferredConnectionParametersCharacteristic.prototype.onReadRequest = function(offset, callback) {
  logger.info('peripheral preferred connection parameters read:', this._value);
  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = PeripheralPreferredConnectionParametersCharacteristic;