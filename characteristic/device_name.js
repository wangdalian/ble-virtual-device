
const util = require('util');
const bleno = require('bleno');
const logger = require('../lib/logger');
const deviceEnum = require('../enum/device');
const BlenoCharacteristic = bleno.Characteristic;

const uuid = '2a00';

const DeviceNameCharacteristic = function() {
  const deviceName = deviceEnum.DEVICE_NAME;
  DeviceNameCharacteristic.super_.call(this, {
    uuid: uuid,
    properties: ['read'],
    value: deviceName
  });
  this._value = Buffer.from(deviceName);
};

util.inherits(DeviceNameCharacteristic, BlenoCharacteristic);

DeviceNameCharacteristic.prototype.onReadRequest = function(offset, callback) {
  logger.info('device name read:', this._value);
  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = DeviceNameCharacteristic;