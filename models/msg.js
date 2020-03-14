const enumLib = require('../libs/enum')
const memory = require('../dbs/memory')
const uidModel = require('./uid')

function add(content) {
  memory.data.msgList.push({
    id: uidModel.get(), 
    categoryId: enumLib.sendMsgType.SIMPLE_ALERT, 
    recvTime: Date.now(), 
    content: content,  
    hasRead: false
  })
}

function del(uid) {
  const index = memory.data.msgList.findIndex(item => item.uid === uid)
  memory.data.msgList.splice(index, 1)
}

module.exports = {
  add,
  del
}