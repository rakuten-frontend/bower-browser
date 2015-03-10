'use strict';

var updateNotifier = require('update-notifier');
var bowerBrowser = require('./');
var pkg = require('../package.json');

module.exports = function (program) {

  var options = {
    path: program.path,
    port: program.port,
    cache: program.cache,
    open: !program.skipOpen,
    silent: !!program.silent
  };

  var notifier = updateNotifier({pkg: pkg});
  if (notifier.update && !options.silent) {
    notifier.notify();
  }

  bowerBrowser(options);

};
