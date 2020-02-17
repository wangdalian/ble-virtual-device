const _ = require('lodash');
const util = require('../../lib/util');
const logger = util.genModuleLogger(__filename);
const services = require('require-all')({
  dirname: __dirname,
  filter: function(fileName) {
    return fileName.includes('service.js') ? null : fileName;
  }
});
const servicesInstance = _.values(services);
const servicesUUID = _.map(servicesInstance, service => service.UUID);
const servicesUUID16 = _.map(servicesUUID, uuid => {
  if (uuid.length === 4) return uuid;
  return parseInt(uuid.split('-')[0], 16).toString(16);
});

logger.info('get services ok:', servicesInstance, servicesUUID);

module.exports = {
  servicesUUID,
  servicesUUID16,
  servicesInstance,
}