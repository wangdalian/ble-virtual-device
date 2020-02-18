
// 前端通知消息处理
const feNotifyHandler = {
  'screenInfo': screenInfoHandler, // 首屏信息
  'message': messageHandler, // 新短信消息
};

const statusIconEnum = {
  'unknown': 'el-icon-question',
  'broadcasting': 'el-icon-phone-outline',
  'connected': 'el-icon-phone'
};

function getStatusIcon(status) {
  return statusIconEnum[status];
}

function getBatteryIcon(battery) {
  // TODO: 生成电量图
  return 'el-icon-delete';
}

function messageHandler(data) {
  console.log('message info:', data);
  globalVue.messageInfo = {
    index: data.index,
    sender: data.sender,
    recvTimeStr: data.recvTimeStr,
    content: data.content
  };
  // 跳转到短信页面
  globalVue.$refs.screens.setActiveItem(1);
}

function screenInfoHandler(data) {
  console.log('screen info:', data);
  globalVue.screenInfo = {
    status: getStatusIcon(data.status),
    hasUnreadMessage: data.hasUnreadMessage ? 'el-icon-message' : '',
    battery: getBatteryIcon(data.battery),
    date: `${data.dateInfo.month}/${data.dateInfo.day}`,
    week: data.dateInfo.week,
    hour: data.dateInfo.hour,
    minute: data.dateInfo.minute,
    name: 'NEC 测试'
  };
}

function feNotifyMessageHandler(message) {
  const data =  JSON.parse(message.data);
  if (!feNotifyHandler[data.type]) return;
  feNotifyHandler[data.type](data.data);
}

function notifyErrorHandler(error) {
  console.warn('notify sse error:', error);
}

function openNotify() {
  console.log('open notify start');
  let notifySse = new EventSource('/api/fe-notify');
  notifySse.onmessage = feNotifyMessageHandler;
  notifySse.onerror = notifyErrorHandler;
  console.log('open notify ok');
}

function setScreenInfoAnimation() {
  setInterval(function() {
    if (globalVue.screenInfo.status !== statusIconEnum['connected']) { // 已经连接状态不闪烁
      globalVue.screenInfo.status = '';
    }
    globalVue.screenInfo.hasUnreadMessage = '';
  }, 1000);
}

let globalVue = null;

const vueMethods = {
  screensChange: screensChangeEventHandler
};

const vueData = function() {
  return {
    screenInfo: {
      status: getStatusIcon('broadcasting'),
      hasUnreadMessage: 'el-icon-message',
      battery: getBatteryIcon(80),
      date: `02/18`,
      week: 'Mon',
      hour: '02',
      minute: '25',
      name: 'NEC 测试'
    },
    messageInfo: {
      index: -1,
      sender: 'E0:DD:70',
      recvTimeStr: '02/28 18:11',
      content: '你好，世界'
    }
  }
};

function createVue(divId) {
  let _vue = new Vue({
    el: `#${divId}`,
    methods: vueMethods,
    data: vueData
  });
  return _vue;
}

// 注册屏幕变化事件，当切换到短信屏幕时发送短息已读请求
function screensChangeEventHandler(screenIndex) {
  console.log('screen changed:', screenIndex);
  if (screenIndex === 1) postMessageReadStatus(globalVue.messageInfo.index);
}

function main() {
  globalVue = createVue('app');
  setScreenInfoAnimation();
  openNotify();
}

main();