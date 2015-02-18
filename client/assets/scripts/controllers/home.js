(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('HomeController', function ($scope, BowerService, ProcessService) {

      // Properties
      $scope.bower = BowerService;
      $scope.process = ProcessService;

    });

}(window));
