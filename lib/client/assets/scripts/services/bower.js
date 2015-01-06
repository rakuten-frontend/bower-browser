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

        // Install package
        install: function (name, version) {
          var target = name;
          if (version !== undefined && version !== '') {
            target = target + '#' + version;
          }
          if (target) {
            ProcessService.execute('bower install --save ' + target, 'install-' + name);
          }
          else {
            ProcessService.execute('bower install', 'install');
          }
        },

        // Uninstall package
        uninstall: function (name) {
          ProcessService.execute('bower uninstall --save ' + name, 'uninstall-' + name);
        },

        // Update package
        update: function () {
          ProcessService.execute('bower update', 'update');
        },

        // Check installation
        isInstalled: function (name) {
          return _.has(this.json.dependencies, name);
        },

        // Get installed version
        getVersion: function (name) {
          return this.json.dependencies[name];
        }

      };

      // Receive WebSocket
      SocketService.on('bower', function (data) {
        service.name = data.name;
        service.path = data.path;
        service.json = data.json || {};
        service.message = data.message || '';
        if (data.message) {
          service.error = true;
        }
      });

      return service;

    });

}(window));
