const db = require('../dbs/memory')

function append(text) {
  db.data.logsText += `${text}\n\n`
  return db.data.logsText
}

module.exports = {
  append
}