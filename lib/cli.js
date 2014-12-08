'use strict';

var bowerBrowser = require('./');

module.exports = function (program) {

  var options = {
    port: program.port || 3000,
    open: !program.skipOpen
  };

  bowerBrowser(options);

};
