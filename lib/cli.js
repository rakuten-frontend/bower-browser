'use strict';

var bowerBrowser = require('./');

module.exports = function (program) {

  var options = {
    path: program.path,
    port: program.port,
    cache: program.cache,
    open: !program.skipOpen,
    silent: !!program.silent
  };

  bowerBrowser(options);

};
