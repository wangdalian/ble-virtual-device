const db = require('../dbs/memory')

// 重新分配notify的mtu大小，并重置序号
function rellocBuffer(size) {
  db.data.notifyBuffer = new ArrayBuffer(size)
  resetSeq()
}

// 用1个字节表示序号，这里只自增序号
function incSeq() {
  const view = new Uint8Array(db.data.notifyBuffer)
  view[0]++
  return getBuffer()
}

// 重置序号
function resetSeq() {
  const view = new Uint8Array(db.data.notifyBuffer)
  view[0] = 0
}

// 保存配置
function saveConf(setting) {
  db.data.notifyConf = setting
}

function getConf() {
  return db.data.notifyConf
}

function getBuffer() {
  return db.data.notifyBuffer
}

function switchOn() {
  db.data.isNotifyOn = true
}

function switchOff() {
  db.data.isNotifyOn = false
}

module.exports = {
  rellocBuffer,
  incSeq,
  resetSeq,
  saveConf,
  getConf,
  getBuffer,
  switchOn,
  switchOff
}