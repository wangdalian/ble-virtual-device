const express = require('express');
const router = express.Router();
const util = require('../lib/util');
const messageService = require('../module/message');

router.post('/read-status/:messageIndex', function(req, res, next) {
  messageService.setReadStatus(req.params.messageIndex, function(err, data) {
    if (err) return util.res500(res, err);
    return util.res200(res, data);
  });
});

module.exports = router;