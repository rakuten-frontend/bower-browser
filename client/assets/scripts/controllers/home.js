'use strict';

var angular = require('angular');

angular.module('bowerBrowser')
  .controller('HomeController', function ($scope, BowerService, ProcessService) {

    // Properties
    $scope.bower = BowerService;
    $scope.process = ProcessService;

  });
