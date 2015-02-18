(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;

  angular.module('bowerBrowser')

    .controller('PaginationController', function ($scope) {

      $scope._ = _;

      // Attributes with default value
      $scope.min = $scope.min || 1;
      $scope.offset = $scope.offset || 2;

      // Initialize properties
      $scope.init = function () {
        $scope.repeat = $scope.offset * 2 + 1;
        if ($scope.repeat > $scope.max) {
          $scope.repeat = $scope.max;
        }

        if ($scope.current < $scope.min + $scope.offset) {
          $scope.repeatStart = $scope.min;
        }
        else if ($scope.current > $scope.max - $scope.offset) {
          $scope.repeatStart = $scope.max - $scope.offset * 2;
        }
        else {
          $scope.repeatStart = $scope.current - $scope.offset;
        }
      };

      $scope.hasPrev = function () {
        return $scope.current > $scope.min;
      };
      $scope.hasNext = function () {
        return $scope.current < $scope.max;
      };
      $scope.hasStart = function () {
        return $scope.current > $scope.min + $scope.offset;
      };
      $scope.hasEnd = function () {
        return $scope.current < $scope.max - $scope.offset;
      };
      $scope.hasStartPadding = function () {
        return $scope.current > $scope.min + ($scope.offset + 1);
      };
      $scope.hasEndPadding = function () {
        return $scope.current < $scope.max - ($scope.offset + 1);
      };

      $scope.$watchGroup(['min', 'max', 'offset'], function () {
        $scope.init();
      });

      $scope.init();

    })

    .directive('appPagination', function () {

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

    });

}(window));
