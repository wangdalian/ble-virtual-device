const util = require('util');
const bleno = require('bleno');
const moment = require('moment');
const utilLib = require('../../lib/util');
const iw02 = require('../../profile/iw02');
const message = require('../../model/message');
const feNotify = require('../../module/fe_notify');

const BlenoCharacteristic = bleno.Characteristic;
const logger = utilLib.genModuleLogger(__filename);

// 文件名为对应的uuid
const uuid = require('path').parse(__filename).name;

const _characteristic = function() {
  _characteristic.super_.call(this, {
    uuid: uuid,
    properties: ['writeWithoutResponse']
  });
};

util.inherits(_characteristic, BlenoCharacteristic);

_characteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  const bleModule = require('../../module/ble');
  logger.info('on write request:', uuid, data, offset, withoutResponse);
  let result = iw02.parsePacketData(data);
  if (!result) return callback(this.RESULT_SUCCESS);
  if (result.type === 'ALERT_ONE_MESSAGE') {
    let messageItem = message.save(result.data.content, bleModule.getClientAddress());
    messageItem.sender = messageItem.sender.toUpperCase();
    messageItem.recvTimeStr = moment(messageItem.recvTime).format('MM/DD HH:mm');
    feNotify.bdMessage(messageItem);
  }
  // TODO: 其他的不支持的类型是否需要返回其他的结果
  callback(this.RESULT_SUCCESS);
};

module.exports = _characteristic;