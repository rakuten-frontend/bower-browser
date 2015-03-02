'use strict';

var _ = require('lodash');

module.exports = [
  'SocketService',
  function (SocketService) {

    var service = {

      // Log message
      log: 'Welcome to bower-browser!\n',

      // Process running or not
      running: false,

      // IDs of running or waiting commands
      queue: [],

      // Check ID(s) in command queue
      isInQueue: function (id) {
        var self = this;
        if (typeof id === 'string') {
          return this.queue.indexOf(id) !== -1;
        }
        if (_.isArray(id)) {
          return _.some(id, function (val) {
            return self.queue.indexOf(val) !== -1;
          });
        }
        return false;
      },

      // WebSocket to execute command
      execute: function (command, id) {
        id = id || '';
        if (id) {
          this.queue.push(id);
        }
        SocketService.emit('execute', {
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
    SocketService.on('log', function (message) {
      service.pushLog(message);
    });
    SocketService.on('added', function (id) {
      if (id && !service.isInQueue(id)) {
        service.queue.push(id);
      }
    });
    SocketService.on('start', function () {
      service.running = true;
    });
    SocketService.on('end', function (id) {
      if (id) {
        service.queue = _.without(service.queue, id);
      }
    });
    SocketService.on('done', function () {
      service.running = false;
    });

    return service;

  }
];
