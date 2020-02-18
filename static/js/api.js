// 发送已读请求
function postMessageReadStatus(messageIndex) {
  if (messageIndex < 0) {
    console.log('post message read status failed, invalid messageIndex');
  }
  axios.post(`/api/message/read-status/${messageIndex}`)
    .then(function(response) {
      console.log('post message read status success:', response);
    })
    .catch(function(error) {
      console.log('post message read status error:', error);
    });
}