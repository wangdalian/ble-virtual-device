const bleno = require('bleno');
const BlenoPrimaryService = bleno.PrimaryService;
const Characteristic = require('../characteristic/0000ff21-0000-1000-8000-00805f9b34fb');

// 文件名为对应的uuid
const uuid = require('path').parse(__filename).name;
const service = new BlenoPrimaryService({
  uuid: uuid, // bleno will remove -
  characteristics: [
    new Characteristic(),
  ]
});
service.UUID = uuid;
module.exports = service;