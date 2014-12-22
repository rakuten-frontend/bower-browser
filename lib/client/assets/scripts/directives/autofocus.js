(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .directive('appAutofocus', function ($timeout, $parse) {

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var model = $parse(attrs.appAutofocus);
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

}(window));
