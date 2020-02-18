/**
 * 设备状态
 */
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);

const statusEnum = {
  UNKNOW: 'unknown', // 未知状态
  BROADCASTING: 'broadcasting', // 广播中
  CONNECTED: 'connected', // 已连接
};

let status = statusEnum.UNKNOW;

function set(_status) {
  if (status !== status) logger.info('set status:', status, _status);
  status = _status;
}

function get() {
  return status;
}

module.exports = {
  set,
  get,
  statusEnum
}