const bleno = require('bleno');
const BlenoPrimaryService = bleno.PrimaryService;
const ApperanceCharacteristic = require('../characteristic/appearance');
const DeviceNameCharacteristic = require('../characteristic/device_name');

const uuid = '1800';

module.exports = new BlenoPrimaryService({
  uuid: uuid,
  characteristics: [
    new DeviceNameCharacteristic(),
    new ApperanceCharacteristic(),
  ]
});