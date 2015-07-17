var express = require('express');
var app = express();
var scanner = require('./lib/app-scanner');
var jsonfile = require('jsonfile');
var path = require('path');

var app_list = [];
var app_directory = 'app';
var app_path = path.join(__dirname, app_directory);

console.log('Initializing Cafeteria apps...');

// Scan all apps
scanner.appList(app_path, function(apps) {
  for (var i = 0; i < apps.length; i++) {

    var the_app = apps[i];

    scanner.appInfo(path.join(app_path, the_app), function(info) {

      var path_app = '/' + info.name;
      var type = info.type;

      switch(info.type) {

        case 'node':
          var module_path = './' + path.join(app_directory, info.name + '/');

          if(info.platform.express) { module_path += 'app'; type = 'express'; }

          try {
            var module = require('./' + module_path);
          } catch(e) {
            module_path += info.app.main;
            var module = require('./' + module_path);
          }

          // Load into routes
          app.use(path_app, module);
          break;

        default:
          var route = require('./lib/app-plain')(info.path);
          app.use(path_app, route);
          break;

      }

      // Log
      console.log('Loaded application \'%s\'. Type: %s.', info.name, info.type);

    });
  };

  // Load config
  var config = jsonfile.readFileSync('./config.json');

  if(config == false) {
    console.log('Could not start server. No configuration found.');
    process.exit();
  }

  var server_port = config.port || 3000;

  var server = app.listen(server_port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Cafeteria server running at http://%s:%s.', host, port);
  });
});