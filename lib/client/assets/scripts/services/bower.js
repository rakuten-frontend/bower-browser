(function (window) {
  'use strict';

  var angular = window.angular;
  var socket = window.io('http://localhost');
  var _ = window._;

  angular.module('bowerBrowser')
    .factory('BowerService', function ($timeout, ProcessService) {

      var service = {

        // bower.json data
        json: {},

        // Install package
        install: function (name, version) {
          var target = name;
          if (version !== undefined && version !== '') {
            target = target + '#' + version;
          }
          if (target) {
            ProcessService.execute('bower install --save ' + target);
          }
          else {
            ProcessService.execute('bower install');
          }
        },

        // Uninstall package
        uninstall: function (name) {
          ProcessService.execute('bower uninstall --save ' + name);
        },

        // Update package
        update: function () {
          ProcessService.execute('bower update');
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
      socket.on('bowerJson', function (data) {
        $timeout(function () {
          service.json = data;
        }, 0);
      });

      return service;

    });

}(window));
