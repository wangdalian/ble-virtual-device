const bleno = require('bleno');
const logger = require('./lib/logger');
const services = require('./ble/service/service');
const advertising = require('./module/advertising');

// TODO: 需要关闭cassiablue，目前只有AC接口，没有AP接口

function bleStateChangeHandler(state) {
  if (state === 'poweredOn') {
    logger.info('state power on, start advertising');
    advertising.startAdvertising(services.servicesUUID);
  } else {
    logger.info('state power on, stop advertising');
    bleno.stopAdvertising();
  }
}

function bleSetServicesHandler(error) {
  if (error) {
    logger.warn('set services error:', error);
    process.exit(1);
  }
}

function bleAdvertisingStartHandler(error) {
  if (error) {
    logger.warn('start advertising error:', error);
    process.exit(1);
  }
  bleno.setServices(services.servicesInstance, bleSetServicesHandler);
}

bleno.on('stateChange', bleStateChangeHandler);
bleno.on('advertisingStart', bleAdvertisingStartHandler);