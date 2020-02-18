/**
 * 设备电量
 */
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);

let battery = 100;

function set(value) {
  if (battery !== value) logger.info('set battery:', battery, value);
  battery = value;
}

function get() {
  return battery;
}

module.exports = {
  set,
  get,
}