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
      defaultInstallOption: '--save',
      defaultInstallVersion: ''
    };

    var service = {

      // Active settings
      data: {},

      // Reset all settings to defaults
      reset: function () {
        this.data = _.cloneDeep(defaults);
      }

    };

    // Initialize setting data
    service.reset();

    return service;

  }
];
