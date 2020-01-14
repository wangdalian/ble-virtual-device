const logger = require('./logger');
const sse = require('./sse');

function init() {
  logger.info('lib index init start');
  sse.init();
  logger.info('lib index init ok');
}

module.exports = {
  init
};