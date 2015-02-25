'use strict';

var bowerBrowser = require('../lib/');

bowerBrowser({
  path: __dirname + '/fixtures',
  port: 3100,
  open: false
});
