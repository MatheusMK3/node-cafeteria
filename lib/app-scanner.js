var path = require('path');
var jsonfile = require('jsonfile');
var fs = require('fs.extra');
var scanner = module.exports = {};

function file_exists(file) {
  try {
    var handle = fs.openSync(file, 'r');
    fs.closeSync(handle);
    return true;
  } catch(e) {
    return false;
  }
}

function noop () { }

/* Discovers the content of this app.
 * returns object:
 * {
 *  name: app name, based on path
 *  type: generalized type of content (node, plain)
 *  app: application data (in case of type being node)
 *  platform: application platform (express, etc)
 * }
 */
scanner.appInfo = function(dir, callback) {
  callback = callback || noop;

  var result = {
    name: path.basename(dir),
    path: dir,
    type: 'plain'
  }

  // Check for Node.js


  if(file_exists(path.join(dir, 'package.json'))) {
    // Read the package info
    jsonfile.readFile(path.join(dir, 'package.json'), function(err, pkg) {

      result.type = 'node';
      result.app = pkg;
      result.platform = {};

      if(pkg.dependencies == undefined) pkg.dependencies = { };

      // Ok, let's try to figure out some platform
      result.platform.express = (pkg.dependencies['express'] != undefined);
      result.platform.socketio = (pkg.dependencies['socket.io'] != undefined);
      result.platform.angular = (pkg.dependencies['angular'] != undefined);

      // Send back
      callback(result);
    });
  } else {
    // Just return the old plaintext website
    callback(result);
  }
}

/* Lists all apps under a directory
 */
scanner.appList = function(dir, callback) {
  callback = callback || noop;

  fs.readdir(dir, function(err, files) {
    var resp = [];

    for (var i = 0; i < files.length; i++) {
      if(fs.lstatSync(path.join(dir, files[i])).isDirectory()) resp = resp.concat(files[i]);
    };

    if(files == null) resp = [];

    callback(resp);
  });
}