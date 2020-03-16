import regeneratorRuntime from '../libs/runtime.js'
const enums = require('../libs/enum')
const util = require('../libs/util')
const co = require('../libs/co');
const wxBle = require('../libs/wxble')
const logLib = require('./log')
const logger = logLib.genModuleLogger('ble')
const profile = require('../profiles/iw02')
const memory = require('../dbs/memory')
const dateTimeChar = require('../chars/dateTime')
const msgModel = require('../models/msg')
const notifyModel = require('../models/notify')
const pageModule = require('./page')

let server = null;
let isStartedAd = false;
let isAddedServices = false;
let isOpenedConnectStatusEvent = false;
let isOpenedCharReadEvent = false;
let isOpenCharWriteEvent = false;
let isConnected = false;

const connectDevices = {};
let notifySyncTimer = null;
let notifySyncCounter = 0;
let dateTimeCharTimer = null;

// 连接、断连事件
// 注意：由于重新进入小程序过程中会存在缓存server的情况，即server无法销毁，我们通过存储当前的server进行对比，只处理当前的事件
function connectStatusEventHandler(res) {
  if (!server || server.serverId.toString() !== res.serverId.toString()) return;
  if (res.connected) {
    isConnected = true
    connectDevices[res.deviceId] = true // 连接成功的加入到连接列表里面
    memory.data.peer = res.deviceId
    wxBle.stopAd(server).then(() => { // 连接成功则停止广播
      logger.info('connected stop ad ok:', res)
      pageModule.getContext('index').updateBandStatus(enums.bandStatus.CONNECT)
      isStartedAd = false
    }).catch(ex => {
      logger.error('connected stop ad err:', res, ex)
      pageModule.getContext('index').updateBandStatus(enums.bandStatus.AD)
      isStartedAd = true
    })
  } else { // 断开连接则开启广播
    isConnected = false
    delete connectDevices[res.deviceId]
    wxBle.atomicStartAdRetry(server, profile.adParam).then(() => { // 连接成功则停止广播
      logger.info('disconnected start ad ok:', res)
      pageModule.getContext('index').updateBandStatus(enums.bandStatus.AD)
      isStartedAd = true
    }).catch(ex => {
      logger.error('disconnected start ad err:', res, ex)
      pageModule.getContext('index').updateBandStatus(enums.bandStatus.INIT)
      isStartedAd = false
    })
  }
}

// 特征值读取事件
// 注意：由于重新进入小程序过程中会存在缓存server的情况，即server无法销毁，我们通过存储当前的server进行对比，只处理当前的事件
function charReadEventHandler(res) {
  if (!server || server.serverId.toString() !== res.serverId.toString()) return;
  if (res.serviceId !== '0000ff20-0000-1000-8000-00805f9b34fb') return; // 无效的service不做处理
  const charId = res.characteristicId;
  const char = profile.service.characteristics.find((item) => item.uuid === charId);
  if (!char) return; // 无效的char操作不做处理
  
  if (charId === profile.dateTimeChar.uuid) { // 读取当前时间
    wxBle.writeCharValue(server, {
      serviceId: res.serviceId,
      characteristicId: res.characteristicId,
      value: memory.data.dateTimeHex,
      callbackId: res.callbackId
    }).catch(ex => {
      let errStr = JSON.stringify(ex)
      if (errStr.includes('no active session')) { // 隐藏了，被回收了??

      }
    })
  } else { // 默认返回0
    wxBle.writeCharValue(server, {
      serviceId: res.serviceId,
      characteristicId: res.characteristicId,
      value: new ArrayBuffer(0),
      callbackId: res.callbackId
    })
  }
}

// 特征值写入事件
// 注意：由于重新进入小程序过程中会存在缓存server的情况，即server无法销毁，我们通过存储当前的server进行对比，只处理当前的事件
function charWriteEventHandler(res) {
  if (!server || server.serverId.toString() !== res.serverId.toString()) return;
  if (res.serviceId !== '0000ff20-0000-1000-8000-00805f9b34fb') return; // 无效的service不做处理
  const charId = res.characteristicId;
  const char = profile.service.characteristics.find((item) => item.uuid === charId);
  if (!char) return; // 无效的char操作不做处理

  let err = null
  if (charId === profile.sendMsgChar.uuid) { // 发送消息
    let result = profile.sendMsgCharDataParser(res.value)
    if (result.err) {
      err = result.err
    } else {
      let msg = msgModel.add(result.value);
      pageModule.getContext('index').updateLatestMsg(msg)
    }
  } else if (charId === profile.notifyChar.uuid) { // 写入触发notify发送测试数据
    let result = profile.notifyCharDataParser(res.value)
    if (result.err) {
      err = result.err
    } else {
      if (result.cmd === profile.notifyCmd.ON) {
        notifyModel.switchOn()
        createNotifySyncTimer();
      } else if (result.cmd === profile.notifyCmd.OFF) {
        notifyModel.switchOff()
        destroyNotifySyncTimer()
      } else if (result.cmd === profile.notifyCmd.CONF) {
        notifyModel.saveConf(result.value)
      } else {
        // never here
      }
    }
  } else {
    logger.warn('unsupported write cmd:', res)
    err = 'unsupported write cmd'
  }
  let value = new ArrayBuffer(1)
  const view = new Uint8Array(value)
  view[0] = err ? 0x01 : 0x00
  wxBle.writeCharValue(server, {
    serviceId: res.serviceId,
    characteristicId: res.characteristicId,
    value: value, // 错误返回01，成功返回00
    needNotify: true, // 是否发送通知
    callbackId: res.callbackId
  })
} 

// 创建notify同步定时器: 定时notify数据
// TODO: notify开关不好使
function createNotifySyncTimer() {
  destroyNotifySyncTimer()
  const notifySyncCmd = notifyModel.getConf()
  notifyModel.rellocBuffer(notifySyncCmd.mtu)
  notifySyncTimer = setInterval(function() {
    wxBle.writeCharValue(server, {
      serviceId: profile.service.uuid,
      characteristicId: profile.notifyChar.uuid,
      value: notifyModel.incSeq(),
      needNotify: true
    }).then(() => {
      notifySyncCounter++; // 更新上报条数
      if (notifySyncCmd.count !== 0 && notifySyncCounter === notifySyncCmd.count) {
        logger.info('exceed notify count, stop it')
        destroyNotifySyncTimer()
      }
    })
  }, notifySyncCmd.interval);
  logger.info('create notify sync timer ok:', notifySyncCmd)
}

// 销毁notify同步定时器
function destroyNotifySyncTimer() {
  clearInterval(notifySyncTimer)
  notifySyncTimer = null
  notifySyncCounter = 0
  logger.info('destroy notify sync timer ok')
}

// 启动：创建server -> 添加服务 -> 广播 -> 监听事件
// TODO: 增加广播开启异常处理, {errCode: 10000, errMsg: "startBLEPeripheralAdvertising:fail:not init:already connected"}
function start() {
  return co(function*() {
    if (!isOpenedConnectStatusEvent) {
      wxBle.openConnectStatusEvent(connectStatusEventHandler)
      isOpenedConnectStatusEvent = true
    }
    if (!server) server = yield wxBle.createServer()
    if (!isOpenedCharReadEvent) {
      wxBle.openCharReadEvent(server, charReadEventHandler)
      isOpenedCharReadEvent = true
    }
    if (!isOpenCharWriteEvent) {
      wxBle.openCharWriteEvent(server, charWriteEventHandler)
      isOpenCharWriteEvent = true
    }
    if (!isAddedServices) yield wxBle.atomicAddServiceRetry(server, profile.service).then(() => {
      isAddedServices = true
    }).catch(ex => {
      isAddedServices = false
      throw(ex)
    })
    if (!isStartedAd) yield wxBle.atomicStartAdRetry(server, profile.adParam).then(() => {
      if (!isConnected) pageModule.getContext('index').updateBandStatus(enums.bandStatus.AD) // 已连接的则不更新图标了
      isStartedAd = true;
    }).catch(ex => {
      let errStr = JSON.stringify(ex)
      pageModule.getContext('index').updateBandStatus(enums.bandStatus.INIT)
       // 已经建立的错误忽略，已开启成功的忽略
      if (!(errStr.includes('already connected'))) {
        isStartedAd = false
        throw(ex)
      }
      isStartedAd = true;
    })
    
    logger.info('start ok')
  }).catch(ex => {
    logger.error('start err:', ex)
    throw(ex)
  })
}

// 定时更新DateTime Char的时间信息
function setDateTimeCharTimer() {
  if (dateTimeCharTimer) clearInterval(dateTimeCharTimer)
  logger.info('set date time char timer')
  dateTimeCharTimer = setInterval(function() {
    let params = dateTimeChar.now()
    util.charFieldsPack(dateTimeChar.fieldTypes, params, memory.data.dateTimeHex)
    // 更新界面时间
    pageModule.getContext('index').updateDateTime()
    // logger.info('update date time char data ok:', params)
  }, 1000)
}

function startBle() {
  return co(function* () {
    setDateTimeCharTimer()
    yield start()
    logger.info('start ble ok')
  }).catch(ex => {
    logger.error('start ble err:', ex)
    throw(ex)
  })
}

module.exports = {
  start,
  startBle
}