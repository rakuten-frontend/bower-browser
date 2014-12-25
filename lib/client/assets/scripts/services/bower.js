(function (window) {
  'use strict';

  var angular = window.angular;
  var socket = window.io('http://localhost');
  var _ = window._;

  angular.module('bowerBrowser')
    .factory('BowerService', function ($rootScope, ProcessService) {

      var service = {

        // bower.json data
        json: {},

        // bower.json path
        path: '',

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
      socket.on('bower', function (data) {
        service.json = data.json;
        service.path = data.path;
        $rootScope.$apply();
      });

      return service;

    });

}(window));
