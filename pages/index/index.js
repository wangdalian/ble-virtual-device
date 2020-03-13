const bleModule = require('../../modules/ble.js')
const app = getApp()

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    // TODO: 检查蓝牙开关
  },
  start: bleModule.startBle,
  stop: bleModule.stop
})
