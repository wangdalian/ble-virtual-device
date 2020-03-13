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

module.exports = {
  formatTime: formatTime,
  promiseRetry: promiseRetry,
}
