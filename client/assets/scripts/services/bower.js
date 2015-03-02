'use strict';

var _ = require('lodash');

module.exports = [
  'SocketService',
  'ProcessService',
  function (SocketService, ProcessService) {

    var service = {

      // Target project
      name: '',
      path: '',

      // bower.json data
      json: {},

      // State and error message
      loaded: false,
      error: false,
      message: '',

      // Load Bower data
      load: function () {
        SocketService.emit('load');
      },

      // Install package
      install: function (pkg, options) {
        var name;
        var opts;
        if (typeof pkg === 'object') {
          opts = pkg;
        }
        else {
          name = pkg;
          opts = options || {};
        }
        var endpoint = name && opts.version ? name + '#' + opts.version : name;
        if (endpoint) {
          ProcessService.execute(['bower install', endpoint, opts.options].join(' '), 'install-' + name);
        }
        else {
          ProcessService.execute(['bower install', opts.options].join(' '), 'install');
        }
      },

      // Uninstall package
      uninstall: function (name, options) {
        var opts = options || {};
        ProcessService.execute(['bower uninstall', name, opts.options].join(' '), 'uninstall-' + name);
      },

      // Update package
      update: function () {
        ProcessService.execute('bower update', 'update');
      },

      // Check installation
      isInstalled: function (name) {
        if (_.has(this.json.dependencies, name)) {
          return 'dependencies';
        }
        if (_.has(this.json.devDependencies, name)) {
          return 'devDependencies';
        }
        return false;
      },

      // Get installed version
      getVersion: function (name, field) {
        field = field || 'dependencies';
        return this.json[field][name];
      }

    };

    // Receive WebSocket
    SocketService.on('bower', function (data) {
      service.loaded = true;
      service.name = data.name;
      service.path = data.path;
      service.json = data.json || {};
      service.message = data.message || '';
      service.error = !!data.message;
    });

    if (!service.loaded) {
      service.load();
    }

    return service;

  }
];
