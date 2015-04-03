'use strict';

var fs = require('fs');

module.exports = function (filepath) {

  try {
    var data = fs.readFileSync(filepath);
    JSON.parse(data);
  }
  catch (e) {
    return false;
  }
  return true;

};
