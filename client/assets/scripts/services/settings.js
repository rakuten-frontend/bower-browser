'use strict';

var _ = require('lodash');

module.exports = [
  function () {

    var defaults = {
      searchField: {
        name: true,
        owner: true,
        description: true
      },
      exactMatch: true,
      ignoreDeprecatedPackages: true,
      newTab: false,
      defaultInstallOptions: '--save',
      defaultInstallVersion: ''
    };

    var service = {

      // Active settings
      config: {},

      // Reset all settings to defaults
      reset: function () {
        _.merge(this.config, defaults);
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
    service.reset();

    return service;

  }
];
