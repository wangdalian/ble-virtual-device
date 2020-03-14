const memory = require('../dbs/memory')

function get() {
  return memory.data.uid++
}

module.exports = {
  get
}