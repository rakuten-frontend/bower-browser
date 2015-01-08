(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;

  angular.module('bowerBrowser')
    .factory('BowerService', function (SocketService, ProcessService) {

      var service = {

        // Target project
        name: '',
        path: '',

        // bower.json data
        json: {},

        // Error and message
        error: false,
        message: '',

        // Reload Bower data
        reload: function () {
          SocketService.emit('reload');
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
          ProcessService.execute(['bower uninstall', name, options.options].join(' '), 'uninstall-' + name);
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
        service.name = data.name;
        service.path = data.path;
        service.json = data.json || {};
        service.message = data.message || '';
        service.error = !!data.message;
      });

      return service;

    });

}(window));
