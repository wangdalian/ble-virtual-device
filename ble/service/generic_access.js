const bleno = require('bleno');
const BlenoPrimaryService = bleno.PrimaryService;
const ApperanceCharacteristic = require('../characteristic/appearance');
const DeviceNameCharacteristic = require('../characteristic/device_name');

const uuid = '1800';
const service = new BlenoPrimaryService({
  uuid: uuid,
  characteristics: [
    new DeviceNameCharacteristic(),
    new ApperanceCharacteristic(),
  ]
});
service.UUID = uuid;

module.exports = service;