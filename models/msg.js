const enumLib = require('../libs/enum')
const memory = require('../dbs/memory')
const uidModel = require('./uid')

function add(content) {
  let msg = {
    id: uidModel.get(), 
    peer: memory.data.peer,
    categoryId: enumLib.sendMsgType.SIMPLE_ALERT, 
    recvTime: Date.now(), 
    content: content,  
    hasRead: false
  }
  if (memory.data.msgList.length > 5) memory.data.msgList.shift()
  memory.data.msgList.push(msg)
  return msg
}

function del(uid) {
  const index = memory.data.msgList.findIndex(item => item.uid === uid)
  memory.data.msgList.splice(index, 1)
}

module.exports = {
  add,
  del
}