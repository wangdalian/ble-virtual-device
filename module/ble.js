const bleno = require('bleno');
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);
const services = require('../ble/service/service');
const advertising = require('./advertising');

// TODO: 需要关闭cassiablue，目前只有AC接口，没有AP接口

let clientAddress = null; // 连接的对端地址

function bleStateChangeHandler(state) {
  if (state === 'poweredOn') {
    logger.info('state power on, start advertising:', services.servicesUUID16);
    advertising.startAdvertising(services.servicesUUID16);
  } else {
    logger.info('state power on, stop advertising');
    bleno.stopAdvertising();
  }
}

function bleSetServicesHandler(error) {
  if (error) {
    logger.error('set services error:', error);
    process.exit(1);
  }
}

function bleAdvertisingStartHandler(error) {
  if (error) {
    logger.error('start advertising error, exit:', error);
    process.exit(1);
  }
  bleno.setServices(services.servicesInstance, bleSetServicesHandler);
}

function bleAcceptHandler(_clientAddress) {
  logger.info('accept handler, record client address:', _clientAddress);
  clientAddress = _clientAddress;
}

function bleDisconnectHandler(_clientAddress) {
  logger.info('disconnect handler, reset client address:', _clientAddress);
  clientAddress = null;
}

function start() {
  bleno.on('accept', bleAcceptHandler);
  bleno.on('disconnect', bleDisconnectHandler);
  bleno.on('stateChange', bleStateChangeHandler);
  bleno.on('advertisingStart', bleAdvertisingStartHandler);
}

module.exports = {
  start,
  clientAddress
};