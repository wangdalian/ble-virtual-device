const bleno = require('bleno');
const config = require('config');
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);
const services = require('../ble/service/service');
const advertising = require('./advertising');
const deviceStatusModel = require('../model/status');

// TODO: 需要关闭cassiablue，目前只有AC接口，没有AP接口

let clientAddress = null; // 连接的对端地址
let _isInitOK = false;

function bleStateChangeHandler(state) {
  _isInitOK = true;
  if (state === 'poweredOn') {
    logger.info('state power on, start advertising:', services.servicesUUID16);
    advertising.startAdvertising(services.servicesUUID16);
  } else {
    logger.info('state power off, stop advertising');
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
    deviceStatusModel.set(deviceStatusModel.statusEnum.UNKNOW);
    process.exit(1);
  }
  // 设置设备广播状态，存在对端地址时，为非广播状态
  if (!clientAddress) deviceStatusModel.set(deviceStatusModel.statusEnum.BROADCASTING);
  bleno.setServices(services.servicesInstance, bleSetServicesHandler);
}

function bleAcceptHandler(_clientAddress) {
  logger.info('accept handler, record client address:', _clientAddress);
  deviceStatusModel.set(deviceStatusModel.statusEnum.CONNECTED); // 设备被连接
  clientAddress = _clientAddress;
}

function bleDisconnectHandler(_clientAddress) {
  logger.info('disconnect handler, reset client address:', _clientAddress);
  clientAddress = null;
}

function setBleInitCheckTimer() {
  const bleWaitInitTime = config.get('ble.waitInitTime');
  setTimeout(function() {
    if (!_isInitOK) {
      logger.warn('ble init failed exit, please close cassia bluetooth in ac:', bleWaitInitTime);
      process.exit(1);
    }
  }, bleWaitInitTime);
}

function start() {
  bleno.on('accept', bleAcceptHandler);
  bleno.on('disconnect', bleDisconnectHandler);
  bleno.on('stateChange', bleStateChangeHandler);
  bleno.on('advertisingStart', bleAdvertisingStartHandler);
  setBleInitCheckTimer();
  logger.info('ble start');
}

function getClientAddress() {
  return clientAddress;
}

module.exports = {
  start,
  getClientAddress
};