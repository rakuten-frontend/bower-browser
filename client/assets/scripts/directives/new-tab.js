'use strict';

module.exports = [
  function () {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(attrs.appNewTab, function (newTab) {
          if (newTab) {
            element.attr('target', '_blank');
            return;
          }
          element.removeAttr('target');
        });
      }
    };

  }
];
