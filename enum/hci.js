/**
 * 定义HCI相关枚举值
 */

// 具体值定义参考：https://www.bluetooth.com/specifications/assigned-numbers/generic-access-profile/
// 各种类型的值结构参考：蓝牙核心规范补充CSS
const AD_DATA_TYPE = {
  Flags: 0x01,
  IncompleteListOf16BitServiceClassUUIDs: 0x02,
  CompleteListOf16BitServiceClassUUIDs: 0x03,
  IncompleteListOf32BitServiceClassUUIDs: 0x04,
  CompleteListOf32BitServiceClassUUIDs: 0x05,
  IncompleteListOf128BitServiceClassUUIDs: 0x06,
  CompleteListOf128BitServiceClassUUIDs: 0x07,
  ShortenedLocalName: 0x08,
  CompleteLocalName: 0x09,
  TxPowerLevel: 0x0A,
  ClassOfDevice: 0x0D,
  SimplePairingHashC: 0x0E,
  SimplePairingHashC192: 0x0E,
  SimplePairingRandomizerR: 0x0F,
  SimplePairingRandomizerR192: 0x0F,
  DeviceID: 0x10,
  SecurityManagerTKValue: 0x10,
  SecurityManagerOutOfBandFlags: 0x11,
  SlaveConnectionIntervalRange: 0x12,
  ListOf16BitServiceSolicitationUUIDs: 0x14,
  ListOf128BitServiceSolicitationUUIDs: 0x15,
  ServiceData: 0x16,
  ServiceData16BitUUID: 0x16,
  PublicTargetAddress: 0x17,
  RandomTargetAddress: 0x18,
  Appearance: 0x19,
  AdvertisingInterval: 0x1A,
  LEBluetoothDeviceAddress: 0x1B,
  LERole: 0x1C,
  SimplePairingHashC256: 0x1D,
  SimplePairingRandomizerR256: 0x1E,
  ListOf32BitServiceSolicitationUUIDs: 0x1F,
  ServiceData32BitUUID: 0x20,
  ServiceData128BitUUID: 0x21,
  LESecureConnectionsConfirmationValue: 0x22,
  LESecureConnectionsRandomValue: 0x23,
  URI: 0x24,
  IndoorPositioning: 0x25,
  TransportDiscoveryData: 0x26,
  LESupportedFeatures: 0x27,
  ChanneMapUpdateIndication: 0x28,
  PBADV: 0x29,
  MeshMessage: 0x2A,
  MeshBeacon: 0x2B,
  BIGInfo: 0x2C,
  BroadcastCode: 0x2D,
  '3DInformationData': 0x3D,
  ManufacturerSpecificData: 0xFF
};

// 占用的字节数
const AD_DATA_SIZE = {
  TypeFieldSize: 0x01, // 广播类型字段占用字节大小
  FlagsParamSize: 0x01, // Flags参数占用字节大小
};

// 参考CSS
const AD_DATA_FLAGS = {
  LELimitedDiscoverableMode: 0x01 << 0,
  LEGeneralDiscoverableMode: 0x01 << 1,
  BREDRNotSupported: 0x01 << 2,
  SimultaneousLEandBREDRToSameDeviceCapableController: 0x01 << 3,
  SimultaneousLEandBREDRToSameDeviceCapableHost: 0x01 << 4,
  // 5..7 比特位保留
};

module.exports = {
  AD_DATA_TYPE,
  AD_DATA_FLAGS,
  AD_DATA_SIZE,
};