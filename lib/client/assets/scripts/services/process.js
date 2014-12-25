(function (window) {
  'use strict';

  var angular = window.angular;
  var socket = window.io('http://localhost');
  var _ = window._;

  angular.module('bowerBrowser')
    .factory('ProcessService', function ($rootScope) {

      var service = {

        // Log message
        log: 'Welcome to bower-browser!\n',

        // Process running or not
        running: false,

        // IDs of running or waiting commands
        queue: [],

        // Check ID in command queue
        isInQueue: function (id) {
          return this.queue.indexOf(id) !== -1;
        },

        // WebSocket to execute command
        execute: function (command, id) {
          id = id || '';
          if (id) {
            this.queue.push(id);
          }
          socket.emit('execute', {
            command: command,
            id: id
          });
        },

        // Push log
        pushLog: function (string) {
          this.log += string;
        }

      };

      // Receive WebSocket
      socket.on('log', function (message) {
        service.pushLog(message);
        $rootScope.$apply();
      });
      socket.on('added', function (id) {
        if (id && !service.isInQueue(id)) {
          service.queue.push(id);
          $rootScope.$apply();
        }
      });
      socket.on('start', function () {
        service.running = true;
        $rootScope.$apply();
      });
      socket.on('end', function (id) {
        if (id) {
          service.queue = _.without(service.queue, id);
          $rootScope.$apply();
        }
      });
      socket.on('done', function () {
        service.running = false;
        $rootScope.$apply();
      });

      return service;

    });

}(window));
