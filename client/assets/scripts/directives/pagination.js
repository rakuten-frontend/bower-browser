'use strict';

module.exports = [
  function () {

    return {
      restrict: 'EA',
      replace: true,
      controller: 'PaginationController',
      templateUrl: '/assets/templates/pagination.html',
      scope: {
        min: '=?',
        max: '=',
        current: '=',
        offset: '=?'
      }
    };

  }
];
