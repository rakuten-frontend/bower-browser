'use strict';

var _ = require('lodash');

module.exports = [
  function () {

    var defaults = {
      searchFields: {
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
      }

    };

    // Initialize settings
    service.reset();

    return service;

  }
];
