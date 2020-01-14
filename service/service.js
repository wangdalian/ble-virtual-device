const _ = require('lodash');
const logger = require('../lib/logger');
const services = require('require-all')({
  dirname: __dirname,
  filter: function(fileName) {
    return fileName.includes('service.js') ? null : fileName;
  }
});
const servicesInstance = _.values(services);
const servicesUUID = _.map(servicesInstance, service => service.uuid);

logger.info('get services ok:', servicesInstance, servicesUUID);

module.exports = {
  servicesUUID,
  servicesInstance,
}