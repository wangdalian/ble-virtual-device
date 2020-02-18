/**
 * 日期时间
 */
const moment = require('moment');
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);

const weekday = ['', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

let timestamp = Date.now();

// 每秒自动更新时间
let timer = setInterval(function() {
  timestamp = timestamp + 1000;
}, 1000);

function set(value) {  
  if (timestamp !== value) logger.info('set date time:', timestamp, value);
  timestamp = value;
}

function get() {
  return timestamp;
}

function paddingWidth2(value) {
  value = value.toString();
  if (value.length === 1) value = `0${value}`; // 宽度为2
  return value;
}

function getDateTimeInfo() {
  const m = moment(timestamp);
  let month = paddingWidth2(m.month() + 1);
  let day = paddingWidth2(m.date());
  let hour = paddingWidth2(m.hour());
  let minute = paddingWidth2(m.minute());
  let week = weekday[m.weekday()];
  return {month, day, hour, minute, week};
}

module.exports = {
  set,
  get,
  getDateTimeInfo
}