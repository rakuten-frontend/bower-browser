'use strict';

var bowerBrowser = require('./');

module.exports = function (program) {

  var options = {
    path: program.path,
    port: program.port,
    open: !program.skipOpen
  };

  bowerBrowser(options);

};
