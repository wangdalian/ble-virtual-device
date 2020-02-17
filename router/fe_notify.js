const express = require('express');
const router = express.Router();
const util = require('../lib/util');
const feNotifyService = require('../module/fe_notify');

router.get('/', function(req, res, next) {
  feNotifyService.getSse(req, res, function(err) {
    if (err) return util.res500(res, err);
    // return util.res200(res, data);
  });
});

module.exports = router;