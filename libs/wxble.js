const logger = require('./log')

function createServer() {
  return wx.createBLEPeripheralServer().then(res => {
    logger.info('create server ok')
    return res.server
  }).catch(ex => {
    logger.error('create server err:', ex)
    throw(ex)
  })
}

function disconnect(deviceId) {
  return wx.closeBLEConnection({deviceId}).then(() => {
    logger.info('disconnect ok:', deviceId)
  }).catch(ex => {
    logger.error('diconnect err:', deviceId, ex)
    throw(ex)
  })
}

function disconnectList(deviceIdList) {
  return Promise.all(deviceIdList, disconnect).then(() => {
    logger.info('disconnect list ok:', deviceIdList)
  }).catch(ex => {
    logger.error('disconnect list err:', ex)
    throw(ex)
  })
}

function startAd(server, param) {
  if (!server) return Promise.reject(`start add: no server`);
  return server.startAdvertising(param).then(() => {
    logger.info('start ad ok:', param)
  }).catch(ex => {
    logger.error('start ad err:', param, ex)
    throw(ex)
  })
}

function addService(server, service) {
  if (!server) return Promise.reject(`add service: no server`);
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
  if (!server) return setTimeout(callback, 0, `open char read event: no server`)
  server.onCharacteristicReadRequest(function(res) {
    logger.info('read event:', res)
    return callback(res)
  })
  logger.info('open char read event ok')
}

function closeCharReadEvent(server, callback) {
  logger.info('close char read event')
  if (!server) return setTimeout(callback, 0, `close char read event: no server`)
  server.offCharacteristicReadRequest(function() {
    logger.info('close char read event ok')
    if (callback) return callback()
  });
}

function openCharWriteEvent(server, callback) {
  if (!server) return setTimeout(callback, 0, `open char write event: no server`)
  server.onCharacteristicWriteRequest(function(res) {
    logger.info('write event:', res)
    return callback(res)
  })
}

function closeCharWriteEvent(server, callback) {
  logger.info('close char write event')
  if (!server) return setTimeout(callback, 0, `close char write event: no server`)
  server.offCharacteristicWriteRequest(function() {
    logger.info('close char write event ok')
    if (callback) return callback()
  });
}

function stopAd(server) {
  if (!server) return Promise.reject(`stop ad: no server`)
  return server.stopAdvertising().then(() => {
    logger.info('stop ad ok')
  }).catch(ex => {
    logger.error('stop add err:', ex)
    throw(ex)
  });
}

function destroyServer(server) {
  if (!server) return Promise.reject(`stop ad: no server`)
  return server.close().then(() => {
    logger.info('destroy server ok')
  }).catch(ex => {
    logger.error('destroy server err:', ex)
    throw(ex)
  })
}

function removeService(server, serviceId) {
  if (!server) return Promise.reject(`stop ad: no server`)
  return server.removeService({serviceId}).then(() => {
    logger.info('remove service ok:', serviceId)
  }).catch(ex => {
    logger.error('remove service err:', ex)
    throw(ex)
  })
}

function openBluetoothAdapter() {
  return wx.openBluetoothAdapter().then(() => {
    logger.info('open bluetooth adapter ok')
  }).catch(ex => {
    logger.error('open bluetooth adapter err:', ex)
    throw(ex)
  })
}

function closeBluetoothAdapter() {
  return wx.closeBluetoothAdapter().then(() => {
    logger.info('close bluetooth adapter ok')
  }).catch(ex => {
    logger.error('close bluetooth adapter err:', ex)
    throw(ex)
  })
}

module.exports = {
  openBluetoothAdapter,
  closeBluetoothAdapter,
  createServer,
  destroyServer,
  startAd,
  stopAd,
  addService,
  removeService,
  disconnect,
  disconnectList,
  openConnectStatusEvent,
  openCharReadEvent,
  openCharWriteEvent,
  closeConnectStatusEvent,
  closeCharReadEvent,
  closeCharWriteEvent
}