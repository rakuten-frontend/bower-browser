'use strict';

var fs = require('fs');

module.exports = [
  function () {

    return {
      restrict: 'EA',
      replace: true,
      controller: 'PaginationController',
      template: fs.readFileSync(__dirname + '/../../templates/pagination.html', 'utf8'),
      scope: {
        min: '=?',
        max: '=',
        current: '=',
        offset: '=?'
      }
    };

  }
];
