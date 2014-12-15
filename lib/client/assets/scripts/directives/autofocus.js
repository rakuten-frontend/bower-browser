(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .directive('appAutofocus', function ($timeout) {

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          scope.$watch(attrs.appAutofocus, function (val) {
            if (val) {
              $timeout(function () {
                element[0].focus();
              });
            }
          });
        }
      };

    });

}(window));
