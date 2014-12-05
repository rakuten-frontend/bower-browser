#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2));
var bowerBrowser = require('./index.js');

bowerBrowser
  .start()
  .open();
