/**
 * 首屏信息
 */
const config = require('config');
const feNotify = require('./fe_notify');
const util = require('../lib/util');
const nameModel = require('../model/name');
const batteryModel = require('../model/battery');
const messageModel = require('../model/message');
const datetimeModel = require('../model/datetime');
const deviceStatusModel = require('../model/status');

const logger = util.genModuleLogger(__filename);
const screenConf = config.get('screen');

function init() {
  setInterval(function() {
    feNotify.bdScreenInfo({
      status: deviceStatusModel.get(),
      hasUnreadMessage: messageModel.hasUnread(),
      battery: batteryModel.get(),
      dateInfo: datetimeModel.getDateTimeInfo(),
      name: nameModel.get()
    });
  }, screenConf.interval);
  logger.info('screen info init ok');
}

module.exports = {
  init
};