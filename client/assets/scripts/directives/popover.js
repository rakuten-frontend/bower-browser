'use strict';

var $ = require('jquery');

module.exports = [
  function () {

    return {
      restrict: 'A',
      link: function (scope, element) {
        $(element).popover();
      }
    };

  }
];
