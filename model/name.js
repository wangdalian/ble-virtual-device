/**
 * 手环名称
 */
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);

let name = 'NEC 测试';

function set(value) {
  if (name !== value) logger.info('set name:', name, value);
  name = value;
}

function get() {
  return name;
}

module.exports = {
  set,
  get,
}