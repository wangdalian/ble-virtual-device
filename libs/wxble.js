const logger = require('./log')

function createServer() {
  return new Promise((resolve, reject) => {
    wx.createBLEPeripheralServer().then(res => {
      logger.info('create server ok')
      resolve(res.server)
    }).catch(ex => {
      logger.error('create server err:', ex)
      reject(ex)
    })
  })
}

function startAd(server, param) {
  return server.startAdvertising(param).then(() => {
    logger.info('start ad ok:', param)
  }).catch(ex => {
    logger.error('start ad err:', param, ex)
    throw(ex)
  })
}

function addService(server, service) {
  return server.addService({service}).then(() => {
    logger.info('add service ok:', service)
  }).catch(ex => {
    logger.error('add service err:', service, ex)
    throw(ex)
  })
}

function openConnectStatusEvent(callback) {
  wx.onBLEPeripheralConnectionStateChanged(function(res) {
    logger.info('connect status event:', res)
    return callback(res)
  });
  logger.info('open connect status event ok')
}

function closeConnectStatusEvent(callback) {
  wx.offBLEPeripheralConnectionStateChanged(function() {
    logger.info('close connect status event ok')
    if (callback) return callback()
  });
  logger.info('close connect status event ok')
}

function openCharReadEvent(server, callback) {
  server.onCharacteristicReadRequest(function(res) {
    logger.info('read event:', res)
    return callback(res)
  })
  logger.info('open char read event ok')
}

function closeCharReadEvent(server, callback) {
  logger.info('close char read event')
  server.offCharacteristicReadRequest(function() {
    logger.info('close char read event ok')
    if (callback) return callback()
  });
}

function openCharWriteEvent(server, callback) {
  server.onCharacteristicWriteRequest(function(res) {
    logger.info('read event:', res)
    return callback(res)
  })
}

function closeCharWriteEvent(server, callback) {
  logger.info('close char write event')
  server.offCharacteristicWriteRequest(function() {
    logger.info('close char write event ok')
    if (callback) return callback()
  });
}

function stopAd(server) {
  return server.stopAdvertising().then(() => {
    logger.info('stop ad ok')
  }).catch(ex => {
    logger.error('stop add err:', ex)
    throw(ex)
  });
}

function destroyServer(server) {
  return server.close().then(() => {
    logger.info('destroy server ok')
  }).catch(ex => {
    logger.error('destroy server err:', ex)
    throw(ex)
  })
}

function removeService(server, serviceId) {
  return server.removeService({serviceId}).then(() => {
    logger.info('remove service ok:', serviceId)
  }).catch(ex => {
    logger.error('remove service err:', ex)
    throw(ex)
  })
}

module.exports = {
  createServer,
  destroyServer,
  startAd,
  stopAd,
  addService,
  removeService,
  openConnectStatusEvent,
  openCharReadEvent,
  openCharWriteEvent,
  closeConnectStatusEvent,
  closeCharReadEvent,
  closeCharWriteEvent
}