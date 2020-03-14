
const enums = require('../libs/enum')

// 注意：这里使用JS的默认字段遍历顺序与定义一致
const fieldTypes = {
  Year: enums.charFormat.UINT16,
  Month: enums.charFormat.UINT8,
  Day: enums.charFormat.UINT8,
  Hours: enums.charFormat.UINT8,
  Minutes: enums.charFormat.UINT8,
  Seconds: enums.charFormat.UINT8,
}

function now() {
  const date = new Date()
  return {
    Year: date.getFullYear(),
    Month: date.getMonth() + 1,
    Day: date.getDate(),
    Hours: date.getHours(),
    Minutes: date.getMinutes(),
    Seconds: date.getSeconds(),
  }
}

module.exports = {
  fieldTypes,
  now,
};