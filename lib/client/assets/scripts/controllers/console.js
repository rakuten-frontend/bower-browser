(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('ConsoleController', function ($scope, $element, $timeout, ProcessService) {

      // Properties
      $scope.templateUrl = '/assets/templates/console.html';
      $scope.process = ProcessService;
      $scope.shown = false;
      $scope.forceShown = false;
      $scope.container = null;

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

      // Auto scroll to bottom
      // TODO: Refactor implementation
      $scope.onload = function () {
        $scope.container = $element.next().find('.console-wrapper');
      };
      $scope.scrollToBottom = function () {
        if ($scope.container) {
          $scope.container.scrollTop($scope.container.prop('scrollHeight') - $scope.container.prop('offsetHeight'), 150);
        }
      };
      $scope.$watch('process.log', function () {
        $timeout(function () {
          $scope.scrollToBottom();
        });
      });

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
