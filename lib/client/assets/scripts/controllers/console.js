(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('ConsoleController', function ($scope, $timeout, ProcessService) {

      // Properties
      $scope.templateUrl = '/assets/templates/console.html';
      $scope.process = ProcessService;
      $scope.shown = false;

      // Update log message
      $scope.$watch('process.running', function (running) {
        $scope.shown = running;
      });

    });

}(window));
