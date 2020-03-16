const db = require('../dbs/memory')

function append(level, text) {
  if (db.data.logsText.length > 100) {
    db.data.logsText.shift()
  }
  db.data.logsText.push({level, text})
  return db.data.logsText
}

module.exports = {
  append
}