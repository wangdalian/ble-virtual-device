const enumLib = require('../../libs/enum')
const utilLib = require('../../libs/util')
const db = require('../../dbs/memory')
const pageModule = require('../../modules/page')
const bleModule = require('../../modules/ble')

// pages/msg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRereshing: false,
    statusBarText: '初始化中...',
    logsText: db.data.logsText,
    dateTime: {
      year: '2020',
      month: '03',
      day: '16',
      hours: '03',
      minutes: '47',
      seconds: '15',
      week: 'Thur'
    },
    latestMsg: {
      peer: 'E0:DD:70', // 当前连接的对端，只显示后3字节
      recvTimeStr: '02/28 18:11', // 最新消息时间
      content: '你好，世界', // 最新消息内容
    },
    bandStatus: enumLib.bandStatus.INIT, // 设备状态, 'init' - 初始状态, 'ad' - 广播, 'connect' - 连接
    help: 
 `<ul>
    <li>FF21：读取当前时间</li>
    <li>FF22：写入短信消息
      <ul>
        <li>21FF310302FF31
          <ul>
            <li>21FF：固定消息头</li>
            <li>31：命令字</li>
            <li>03：载荷长度</li>
            <li>02FF31：消息内容
              <ul>
                <li>02：短信类型(暂时只支持此一种)</li>
                <li>FF：消息内容为utf8编码(暂时只支持此一种)</li>
                <li>31：字符1</li>
              </ul>
            </li>
          <ul>
        </li>
      </ul>
    </li>
    <li>FF22：上报通知内容
      <ul>
        <li>01XXYY: 第一个字节递增</li>
      </ul>
    </li>
    <li>FF22：写入通知配置
      <ul>
        <li>21FF310302FF31
          <ul>
            <li>0000：关闭通知</li>
            <li>0100：开启通知</li>
            <li>0200101112
              <ul>
                <li>0200：配置参数</li>
                <li>10：每包字节数，默认20B</li>
                <li>11：上报间隔(ms)，默认1s</li>
                <li>11：上报包数，默认0，一直上报</li>
              </ul>
            </li>
          <ul>
        </li>
      </ul>
    </li>
  <ul>
`
  },
  updateLatestMsg: function(msgItem) {
    let date = new Date(msgItem.recvTime)
    let datePadding = utilLib.getDateTimePadding(date)
    let dateStr = `${datePadding.month}/${datePadding.day} ${datePadding.hour}:${datePadding.minute}`
    this.setData({
      latestMsg: {
        peer: msgItem.peer.split(':').splice(3).join(':'), 
        recvTimeStr: dateStr, 
        content: msgItem.content
      }
    })
  },
  updateBandStatus: function(status) {
    this.setData({bandStatus: status})
  },
  updateDateTime: function () {
    const date = new Date()
    const weekday = ['', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    const padding = utilLib.padding2
    const dateTime = {
      year: date.getFullYear(),
      month: padding(date.getMonth() + 1),
      day: padding(date.getDate()),
      hours: padding(date.getHours()),
      minutes: padding(date.getMinutes()),
      seconds: padding(date.getSeconds()),
      week: weekday[date.getDay()]
    }
    this.setData({dateTime: dateTime})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageModule.setContext('index', this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initBle()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  initBle: function () {
    wx.stopPullDownRefresh()
    if (this.isRereshing) { // 刷新处理中，直接返回
      this.setData({statusBarText: '初始化中...'})
      return; 
    }
    this.isRereshing = true
    this.setData({statusBarText: '初始化中...'})
    bleModule.startBle().then(() => {
      this.setData({statusBarText: '初始化成功'})
    }).catch(ex => {
      let errStr = JSON.stringify(ex)
      if (errStr.includes('not available')) {
        this.setData({statusBarText: '初始化失败，请开启蓝牙和GPS'})
      } else if (errStr.includes('add service fail')) {
        this.setData({statusBarText: '添加服务失败，请下拉重试'})
      } else {
        this.setData({statusBarText: '初始化失败，请下拉重试'})
      }
    }).finally(() => {
      this.isRereshing = false;
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initBle()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
