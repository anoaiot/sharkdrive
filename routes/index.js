var express = require('express');
var router = express.Router();
var os = require('os');
var ifaces = os.networkInterfaces();
var ip;

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0
    ;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return;
    }
    ip = iface.address;
  });
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: ip });
});

module.exports = router;
