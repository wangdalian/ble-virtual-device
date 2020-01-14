
const util = require('util');
const bleno = require('bleno');
const logger = require('../lib/logger');
const BlenoCharacteristic = bleno.Characteristic;

const uuid = '2a01';

const AppearanceCharacteristic = function() {
  AppearanceCharacteristic.super_.call(this, {
    uuid: uuid,
    properties: ['read']
  });
  this._value = Buffer.from('c000', 'hex');
};

util.inherits(AppearanceCharacteristic, BlenoCharacteristic);

AppearanceCharacteristic.prototype.onReadRequest = function(offset, callback) {
  logger.info('appearance read:', this._value);
  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = AppearanceCharacteristic;