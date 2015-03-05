'use strict';

var _ = require('lodash');
_.mixin(require('lodash-deep'));

var settingsApi = '/api/settings.json';

module.exports = [
  '$http',
  'SocketService',
  '$timeout',
  function ($http, SocketService, $timeout) {

    var defaults = {
      searchField: {
        name: true,
        owner: true,
        description: true,
        keyword: true
      },
      exactMatch: true,
      ignoreDeprecatedPackages: true,
      newTab: false,
      defaultInstallOptions: '--save',
      defaultInstallVersion: ''
    };

    var service = {

      // Active settings
      config: _.cloneDeep(defaults),

      // State for settings
      loaded: false,

      // Set settings
      // Invalid properties are ignored
      set: function (data) {
        var validData = _.deepMapValues(this.config, function (value, propertyPath) {
          return _.deepGet(data, propertyPath.join('.'));
        });
        _.merge(this.config, validData);
      },

      // Load settings from server
      load: function () {
        var self = this;
        $http.get(settingsApi)
          .success(function (data) {
            self.set(data);
            $timeout(function () {
              self.loaded = true;
            });
          })
          .error(function () {
            self.reset();
            $timeout(function () {
              self.loaded = true;
            });
          });
      },

      // Send settings to server
      save: function () {
        SocketService.emit('settings', this.config);
      },

      // Reset all settings to defaults
      reset: function () {
        this.set(defaults);
      },

      // Warn when no search field is selected
      hasSearchFieldWarning: function () {
        var searchField = this.config.searchField;
        return searchField &&
          Object.keys(searchField).every(function (key) {
            return searchField[key] === false;
          });
      }

    };

    // Initialize settings
    service.load();

    return service;

  }
];
