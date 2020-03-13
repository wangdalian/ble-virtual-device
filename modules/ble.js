const wxBle = require('../libs/wxble')
const util = require('../libs/util')
const logger = require('../libs/log')
const profile = require('../profiles/iw02')

let server = null;

// TODO: 增加蓝牙开关检查

// 连接、断连事件
function connectStatusEventHandler(res) {

}

// 特征值读取事件
function charReadEventHandler(res) {

}

// 特征值写入事件
function charWriteEventHandler(res) {

} 

// 启动：创建server -> 添加服务 -> 广播 -> 监听事件
function start() {
  return wxBle.createServer().then(_server => {
    server = _server
    // 注意: 添加服务经常会返回失败，增加重试逻辑
    return util.promiseRetry(wxBle.addService, 'wxBle.addService', 5, 200, server, profile.service)
  }).then(() => {
    return wxBle.startAd(server, profile.adParam)
  }).then(() => {
    wxBle.openConnectStatusEvent(connectStatusEventHandler)
    wxBle.openCharReadEvent(server, charReadEventHandler)
    wxBle.openCharWriteEvent(server, charWriteEventHandler)
  }).then(() => {
    logger.info('start ok')
  }).catch(ex => {
    logger.error('start err:', ex)
  })
}

// 停止：取消监听事件 -> 停止广播 -> 删除服务 -> 关闭server
function stop() {
  return new Promise((resolve, reject) => {
    wxBle.closeConnectStatusEvent()
    if (server) wxBle.closeCharWriteEvent(server)
    if (server) wxBle.closeCharReadEvent(server)
  }).then(wxBle.stopAd).then(() => {
    wxBle.removeService(profile.service.uuid)
  }).then(wxBle.destroyServer).then(() => {
    logger.info('stop ok')
  }).catch(ex => {
    logger.error('stop err:', ex)
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

module.exports = {
  init,
  start,
  stop
}