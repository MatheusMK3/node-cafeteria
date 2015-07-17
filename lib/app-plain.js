module.exports = function(app_root) {
  var express = require('express');
  var path = require('path');

  var router = express.Router();

  router.get('/', function(req, res) {
    res.sendFile(path.join(app_root, 'index.html'));
  });

  router.use(express.static(app_root));

  return router;
}