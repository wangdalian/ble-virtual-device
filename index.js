const thenjs = require('thenjs');
const util = require('./lib/util');
const sseLib = require('./lib/sse');
const logger = util.genModuleLogger(__filename);
const bleModule = require('./module/ble');
const appModule = require('./module/app');
const screenInfoModule = require('./module/screen_info');

process.on('uncaughtException', function(error) {
  logger.warn('uncaught exception exit:', error.stack ? error.stack : JSON.stringify(error));
  process.exit(1);
});

function main(callback) {
  thenjs(function(cont) {
    screenInfoModule.init();
    cont(null, null);
  }).then(function(cont) {
    sseLib.init();
    cont(null, null);
  }).then(function(cont) {
    bleModule.start();
    cont(null, null);
  }).then(function(cont) {
    appModule.init(cont);
  }).fin(function(cont, err, ret) {
    return callback(err, null);
  });
}

main(function(err) {
  if (err) {
    logger.warn('app start error, exit:', err);
    process.exit(1);
  } else {
    logger.info('app start ok');
  }
});