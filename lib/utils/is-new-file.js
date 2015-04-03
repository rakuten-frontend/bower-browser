'use strict';

var fs = require('fs');

module.exports = function (filepath, tty) {

  try {
    var stat = fs.statSync(filepath);
    var isNew = new Date() - stat.mtime < tty * 1000;
  }
  catch (e) {
    return false;
  }
  return isNew;

};
