(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app.controllers.console', [
      'app.services.process'
    ])

    .controller('ConsoleController', function ($scope, $timeout, ProcessService) {

      // Properties
      $scope.templateUrl = '/assets/templates/console.html';
      $scope.log = ProcessService.log();

      // Update log message
      $scope.$watch(function () { return ProcessService.log(); }, function () {
        $scope.log = ProcessService.log();
      });

    });

}(window));
