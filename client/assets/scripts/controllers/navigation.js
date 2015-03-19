'use strict';

module.exports = [
  '$scope',
  'SettingsService',
  function ($scope, SettingsService) {

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

  }
];
