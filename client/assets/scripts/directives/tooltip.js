'use strict';

var $ = require('jquery');

module.exports = [
  function () {

    return {
      restrict: 'A',
      link: function (scope, element) {
        var $element = $(element);
        $element.tooltip();
        $element.click(function () {
          $element.tooltip('hide');
        });
      }
    };

  }
];
