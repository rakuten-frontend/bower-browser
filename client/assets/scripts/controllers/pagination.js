'use strict';

var _ = require('lodash');

module.exports = [
  '$scope',
  function ($scope) {

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
        if ($scope.repeatStart < $scope.min) {
          $scope.repeatStart = $scope.min;
        }
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
      return $scope.repeatStart > $scope.min;
    };
    $scope.hasEnd = function () {
      return $scope.repeatStart + $scope.repeat - 1 < $scope.max;
    };
    $scope.hasStartPadding = function () {
      return $scope.repeatStart > $scope.min + 1;
    };
    $scope.hasEndPadding = function () {
      return $scope.repeatStart + $scope.repeat - 1 < $scope.max - 1;
    };

    $scope.$watchGroup(['min', 'max', 'offset'], function () {
      $scope.init();
    });

    $scope.init();

  }
];
