#!/usr/bin/env node
'use strict';

var BowerBrowser = require('./');
var pkg = require('../package.json');

var argv = require('minimist')(process.argv.slice(2));
var usage = pkg.description + '.\n\n' +
  'USAGE:\n' +
  '  bower-browser [options]\n\n' +
  'OPTIONS:\n' +
  '  -p <number>, --port=<number>\n' +
  '    Specify the port number of bower-browser server.\n' +
  '    Default port is 3000.\n\n' +
  '  -o <boolean>, --open=<boolean>\n' +
  '    Set false to prevent opening your browser at the start.\n' +
  '    If omit this or set true, browser will open the app automatically.\n\n' +
  '  -h, --help\n' +
  '    Display command usage and exit.\n\n' +
  '  -v, --version\n' +
  '    Display version and exit.';

var options = {
  port: argv.p || argv.port || 3000,
  open: argv.o === 'false' || argv.open === 'false' ? false : true
};

if (argv.h || argv.help) {
  console.log(usage);
  return;
}
if (argv.v || argv.version) {
  console.log(pkg.version);
  return;
}

new BowerBrowser(options).start();
