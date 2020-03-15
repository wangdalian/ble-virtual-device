const logger = require('./log');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function promiseWait(time) { 
  return new Promise(function (resolve) { 
    return setTimeout(resolve, time || 0); 
  }); 
}; 

function promiseRetry(fn, fnName, count, delay, ...p) { 
  return fn(...p).then().catch(function (err) { 
    if (count > 0) {
      return promiseWait(delay).then(function() { 
        return promiseRetry(fn, fnName, count - 1, delay, ...p); 
      })
    } else {
      const info = {fnName, count, delay, err}
      return Promise.reject(`promise retry fail: ${info}`);
    }
  }); 
}; 

function uint8Array2Utf8(buffer) {
  let encodedString = String.fromCharCode.apply(null, buffer)
  let decodedString = decodeURIComponent(escape((encodedString)))
  return decodedString
}

// 将给定的值打包为ArrayBuffer
// TODO: 支持类型嵌套
function charFieldsPack(fieldTypes, params, buffer) {
  params = params || {}
  let bytes = 0
  let values = {}

  // 过滤字段并记录值
  for (let field in fieldTypes) {
    const type = fieldTypes[field]
    bytes = bytes + type.length
    values[field] = params[field] || type.value;
  }
  // 将各个字段打包到buffer
  let _buffer = buffer || new ArrayBuffer(bytes)
  let offset = 0, view = null
  for (let field in values) {
    let type = fieldTypes[field]
    if (type.name === 'uint8') {
      view = new Uint8Array(_buffer, offset, type.length)
    } else if (type.name === 'uint16') {
      view = new Uint16Array(_buffer, offset, type.length)
    }
    view[0] = values[field]
    offset = offset + fieldTypes[field].length
  }
  return _buffer
}

module.exports = {
  formatTime,
  promiseWait,
  promiseRetry,
  charFieldsPack,
  uint8Array2Utf8,
}
