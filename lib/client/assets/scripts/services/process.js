(function (window) {
  'use strict';

  var angular = window.angular;
  var socket = window.io('http://localhost');

  angular.module('bowerBrowser')
    .factory('ProcessService', function ($timeout) {

      var service = {

        // Log message
        log: 'Welcome to bower-browser!\n',

        // Process running or not
        running: false,

        // WebSocket to execute command
        execute: function (command) {
          socket.emit('execute', command);
        },

        // Push log
        pushLog: function (string) {
          this.log += string;
        }

      };

      // Receive WebSocket
      socket.on('log', function (message) {
        $timeout(function () {
          service.pushLog(message);
        });
      });
      socket.on('exec', function () {
        $timeout(function () {
          service.running = true;
        });
      });
      socket.on('close', function () {
        $timeout(function () {
          service.running = false;
        });
      });

      return service;

    });

}(window));
