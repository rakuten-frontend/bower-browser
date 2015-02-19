'use strict';

var angular = require('angular');

angular.module('bowerBrowser')
  .directive('appScroll', function ($timeout) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        // Scroll to bottom when model is changed
        scope.$watch(attrs.appScroll, function () {
          $timeout(function () {
            element.duScrollTop(element.prop('scrollHeight') - element.prop('offsetHeight'), 150);
          });
        });
      }
    };

  });
