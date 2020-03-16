const logModel = require('../models/log')
const pageModule = require('./page')

function parseArgument(argument) {
  const type = typeof argument
  if (type === 'object') return JSON.stringify(argument)
  return argument
}

function parseArguments(params) {
  const result = []
  for (let key in params) {
    result.push(parseArgument(params[key]))
  }
  return result.join()
}

const logLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
}

function genModuleLogger(moduleFileName) {
  const moduleName = moduleFileName;
  return {
    info: function() {
      let info = `[${new Date().toISOString()}] [INFO] [${moduleName}] ${parseArguments(arguments)}`
      if (console.log) console.log(info)
      pageModule.getContext('index').setData({logsText: logModel.append(logLevel.INFO, info)})
    },
    warn: function() {
      let info = `[${new Date().toISOString()}] [WARN] [${moduleName}] ${parseArguments(arguments)}`
      if (console.log) console.log(info)
      pageModule.getContext('index').setData({logsText: logModel.append(logLevel.WARN, info)})
    },
    error: function() {
      let info = `[${new Date().toISOString()}] [ERROR] [${moduleName}] ${parseArguments(arguments)}`
      if (console.error) console.error(info)
      pageModule.getContext('index').setData({logsText: logModel.append(logLevel.ERROR, info)})
    },
  };
}

module.exports = {
  genModuleLogger,
}