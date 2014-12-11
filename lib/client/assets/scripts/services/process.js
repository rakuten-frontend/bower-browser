(function (window) {
  'use strict';

  var angular = window.angular;
  var socket = window.io('http://localhost');

  angular

    .module('app.services.process', [
    ])

    .factory('ProcessService', function ($timeout) {

      var log = 'Welcome to bower-browser!\n';

      var service = {

        // WebSocket to execute command
        execute: function (command) {
          this.log('\n$ ' + command + '\n');
          socket.emit('execute', command);
        },

        // Get or set log
        log: function (string) {
          if (typeof string === 'undefined') {
            return log;
          }
          else {
            log += string;
            return this;
          }
        }

      };

      // Receive WebSocket
      socket.on('log', function (message) {
        $timeout(function () {
          service.log(message);
        }, 0);
      });

      return service;

    });

}(window));
