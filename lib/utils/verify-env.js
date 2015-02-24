'use strict';

var which = require('which');
var isRoot = require('is-root');
var chalk = require('chalk');

module.exports = function () {

  var warnings = [];

  // Require bower installed
  try {
    which.sync('bower');
  }
  catch (error) {
    warnings.push(chalk.red('"bower" not found!') + '\nbower-browser executes "bower" in background.\nPlease install "bower" and run bower-browser again.\n$ npm install -g bower\n');
  }

  // Prevent running with `sudo`
  if (isRoot()) {
    warnings.push(chalk.red('Failed to start bower-browser!') + '\nbower-browser doesn\'t support running with root permission\nbecause "bower" is a user command.\nTry running bower-browser without "sudo".\n');
  }

  return warnings.length ? warnings : null;

};
