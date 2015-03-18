'use strict';

module.exports = [
  '$scope',
  'SettingsService',
  function ($scope, SettingsService) {

    // Properties
    $scope.config = SettingsService.config;

  }
];
