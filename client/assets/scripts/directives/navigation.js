'use strict';

var fs = require('fs');

module.exports = [
  function () {

    return {
      restrict: 'EA',
      replace: true,
      controller: 'NavigationController',
      template: fs.readFileSync(__dirname + '/../../templates/navigation.html', 'utf8')
    };

  }
];
