/**
 * 广播包业务
 */
const bleno = require('bleno');
const config = require('config');
const logger = require('../lib/util').genModuleLogger(__filename);
const adModel = require('../model/ad');
const scanModel = require('../model/scan');

const advertisingConf = config.get('advertising');

function startAdvertising(uuids) {
  setInterval(function() {
    let adData = adModel.pack(uuids);
    let scanData = scanModel.pack();
    bleno.startAdvertisingWithEIRData(adModel.pack(uuids), scanModel.pack(), function(error) {
      logger.info('start advertising with data:', error ? error : 'ok', adData.toString('hex'), scanData.toString('hex'));
    });
  }, advertisingConf.interval);
}

module.exports = {
  startAdvertising
};