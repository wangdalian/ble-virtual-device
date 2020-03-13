import regeneratorRuntime from '../libs/runtime.js'
const co = require('../libs/co');
const wxBle = require('../libs/wxble')
const util = require('../libs/util')
const logger = require('../libs/log')
const profile = require('../profiles/iw02')

let server = null;
const connectDevices = {};

// TODO: 增加蓝牙开关检查

// 连接、断连事件
function connectStatusEventHandler(res) {
  if (res.connected) {
    connectDevices[res.deviceId] = true // 连接成功的加入到连接列表里面
    wxBle.stopAd(server).then(() => {
      logger.info('connected stop ad ok:', res)
    }).catch(ex => {
      logger.error('connected stop ad err:', res, ex)
    })
  }
}

// 特征值读取事件
function charReadEventHandler(res) {

}

// 特征值写入事件
function charWriteEventHandler(res) {

} 

// 启动：创建server -> 添加服务 -> 广播 -> 监听事件
// TODO: 增加广播开启异常处理, {errCode: 10000, errMsg: "startBLEPeripheralAdvertising:fail:not init:already connected"}
function start() {
  return co(function*() {
    yield wxBle.openBluetoothAdapter()
    server = yield wxBle.createServer()
    // 注意: 添加服务经常会返回失败，增加重试逻辑
    yield wxBle.addService(server, profile.service)
    yield wxBle.startAd(server, profile.adParam)
    wxBle.openConnectStatusEvent(connectStatusEventHandler)
    wxBle.openCharReadEvent(server, charReadEventHandler)
    wxBle.openCharWriteEvent(server, charWriteEventHandler)
    logger.info('start ok')
  }).catch(ex => {
    logger.error('start err:', ex)
    throw(ex)
  })
}

// 停止：取消监听事件 -> 停止广播 -> 删除服务 -> 关闭server
// TODO: 这里的所有操作都不会主动断开连接，需要官方支持
// 调用disconnectList会提示没有连接信息
function stop() {
  return co(function*() {
    if (server) yield wxBle.stopAd(server).catch(logger.error)
    yield wxBle.disconnect(Object.keys(connectDevices)[0]).catch(logger.error)
    yield wxBle.disconnectList(Object.keys(connectDevices)).catch(logger.error) // 断开现有的连接
    if (server) yield wxBle.removeService(server, profile.service.uuid).catch(logger.error)
    wxBle.closeConnectStatusEvent()
    if (server) wxBle.closeCharWriteEvent(server)
    if (server) wxBle.closeCharReadEvent(server)
    if (server) yield wxBle.destroyServer(server).catch(logger.error)
    yield wxBle.closeBluetoothAdapter().catch(logger.error)
    logger.info('stop ok')
  }).catch(ex => {
    logger.error('stop err:', ex)
    throw(ex)
  });
}

function restart() {
  return stop().then(start).catch(ex => {
    logger.error('restart err:', ex)
    throw(ex)
  })
}

// 启动服务：重试3次，失败则关闭
function init() {
  return util.promiseRetry(start, 'start', 3, 500).then(() => {
    logger.info('start retry ok')
  }).catch(ex => {
    logger.error('start retry err:', ex)
    close()
  })
}

function startBle() {
  return util.promiseRetry(restart, 'restart', 5, 200).then(() => {
    logger.info('start ble ok')
  }).catch(ex => {
    logger.error('start ble err:', ex)
    throw(ex)
  })
}

module.exports = {
  init,
  start,
  stop,
  restart,
  startBle
}