#!/usr/bin/env node
'use strict';

var bowerBrowser = require('./index.js');
var pkg = require('../package.json');

var argv = require('minimist')(process.argv.slice(2));
var usage = pkg.description + '.\n\n' +
  'Usage:\n' +
  '  bower-browser\n\n' +
  'Options:\n' +
  '  -h, --help        Display command usage and exit.\n' +
  '  -v, --version     Display version and exit.';

if (argv.h || argv.help) {
  console.log(usage);
  return;
}
if (argv.v || argv.version) {
  console.log(pkg.version);
  return;
}

bowerBrowser
  .start()
  .open();
