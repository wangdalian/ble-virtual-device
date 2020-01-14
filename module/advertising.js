/**
 * 广播包业务
 */
const bleno = require('bleno');
const config = require('config');
const logger = require('../lib/logger');
const adModel = require('../model/ad');
const scanModel = require('../model/scan');

const advertisingConf = config.get('advertising');

function startAdvertising(uuids) {
  setInterval(function() {
    bleno.startAdvertisingWithEIRData(adModel.pack(uuids), scanModel.pack(), function(error) {
      logger.info('start advertising with data:', error ? error : 'ok');
    });
  }, advertisingConf.interval);
}

module.exports = {
  startAdvertising
};