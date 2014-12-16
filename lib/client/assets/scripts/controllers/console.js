(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('ConsoleController', function ($scope, $timeout, ProcessService) {

      // Properties
      $scope.templateUrl = '/assets/templates/console.html';
      $scope.process = ProcessService;
      $scope.shown = false;
      $scope.forceShown = false;

      // Show panel
      $scope.show = function (force) {
        $scope.shown = true;
        if (force) {
          $scope.forceShown = true;
        }
      };

      // Hide panel
      $scope.hide = function (force) {
        if (force) {
          $scope.shown = false;
          $scope.forceShown = false;
        }
        else if (!$scope.forceShown) {
          $scope.shown = false;
        }
      };

      // Update log message
      $scope.$watch('process.running', function (running) {
        if (running) {
          $scope.show();
        }
        else {
          $timeout(function () {
            $scope.hide();
          }, 2000);
        }
      });

    });

}(window));
