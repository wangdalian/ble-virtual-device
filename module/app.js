const config = require('config');
const express = require('express');
const util = require('../lib/util');
const logger = util.genModuleLogger(__filename);
const middlewareIndex = require('../middleware/index');

const app = express();
const port = config.get('app.port') || 3000;

function start(app, callback) {
  app.listen(port, function(err) {
    if (err) {
      logger.warn('app start err:', port);
      return callback(err, null);
    }
    logger.info('app start ok:', port);
    return callback(null, null);
  });
}

function init(callback) {
  logger.info('app module init start');
  middlewareIndex.registerAll(app);
  start(app, function(err) {
    if (err) logger.warn('app module init err:', JSON.stringify(err));
    else logger.info('app module init ok');
    return callback(err, null);
  });
}

module.exports = {
  app,
  init
};