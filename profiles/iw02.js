const enums = require('../libs/enum');

const service = {
  uuid: '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  characteristics: [
    {
      uuid: '49535343-1e4d-4bd9-ba61-23c647249616',
      value: new Uint8Array(20),
      properties: {
        notify: true,
        write: true,
        read: true,
      },
      permission: {
        readable: true,
        writeable: true
      },
      descriptors: [
        {
          uuid: '49535343-1e4d-4bd9-ba61-23c647249616',
          permission: {
            write: true,
            read: true
          },
          value: new Uint8Array(20),
        },
        {
          uuid: '00002902-0000-1000-8000-00805f9b34fb',
          permission: {
            write: true,
            read: true
          },
          value: new Uint8Array(20),
        }
      ]
    }
  ]
};

const adParam = {
  advertiseRequest: {
    deviceName: 'WX VBAND',
    connectable: true,
    serviceUuids: [service.uuid]
  },
  powerLevel: enums.adPowerLevel.HIGH
}

module.exports = {
  service,
  adParam
}