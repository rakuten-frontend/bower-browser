'use strict';

var angular = require('angular');

angular.module('bowerBrowser')
  .directive('appFocus', function ($timeout, $parse) {

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.appFocus);
        scope.$watch(model, function (val) {
          if (val) {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function () {
          scope.$apply(model.assign(scope, false));
        });
      }
    };

  });
