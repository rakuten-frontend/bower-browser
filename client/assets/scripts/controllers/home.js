'use strict';

module.exports = [
  '$scope',
  'BowerService',
  'ProcessService',
  function ($scope, BowerService, ProcessService) {

    // Properties
    $scope.bower = BowerService;
    $scope.process = ProcessService;

  }
];
