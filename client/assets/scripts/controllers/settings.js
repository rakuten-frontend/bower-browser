'use strict';

var _ = require('lodash');

module.exports = [
  '$scope',
  'SettingsService',
  function ($scope, SettingsService) {

    // Properties
    $scope.settings = SettingsService;
    $scope.config = SettingsService.config;

    // Save settings when updated
    $scope.$watch('config', function (newValue, oldValue) {
      if ($scope.settings.loaded && !_.isEqual(newValue, oldValue)) {
        $scope.settings.save();
      }
    }, true);

  }
];
