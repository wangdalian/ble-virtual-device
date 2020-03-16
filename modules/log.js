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
  return result.join(', ')
}

function genModuleLogger(moduleFileName) {
  const moduleName = moduleFileName;
  return {
    info: function() {
      let info = `[${new Date().toISOString()}] [INFO] [${moduleName}] ${parseArguments(arguments)}`
      console.log(info)
      pageModule.getContext('index').setData({logsText: logModel.append(info)})
    },
    warn: function() {
      let info = `[${new Date().toISOString()}] [WARN] [${moduleName}] ${parseArguments(arguments)}`
      console.log(info)
      pageModule.getContext('index').setData({logsText: logModel.append(info)})
    },
    error: function() {
      let info = `[${new Date().toISOString()}] [ERROR] [${moduleName}] ${parseArguments(arguments)}`
      console.error(info)
      pageModule.getContext('index').setData({logsText: logModel.append(info)})
    },
  };
}

module.exports = {
  genModuleLogger,
}