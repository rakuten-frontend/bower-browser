'use strict';

module.exports = [
  '$scope',
  '$rootScope',
  'SettingsService',
  function ($scope, $rootScope, SettingsService) {

    // Properties
    $scope.config = SettingsService.config;
    $scope.shown = false;

    // Show navigation (for tablet layout)
    $scope.show = function () {
      $scope.shown = true;
    };

    // Hide navigation (for tablet layout)
    $scope.hide = function () {
      $scope.shown = false;
    };

    $rootScope.$on('$stateChangeStart', function () {
      $scope.hide();
    });

  }
];
