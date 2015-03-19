'use strict';

var fs = require('fs');

module.exports = [
  function () {

    return {
      restrict: 'EA',
      replace: true,
      scope: true,
      controller: 'ConsoleController',
      template: fs.readFileSync(__dirname + '/../../templates/console.html', 'utf8')
    };

  }
];
