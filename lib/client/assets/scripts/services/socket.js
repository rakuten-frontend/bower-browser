(function (window) {
  'use strict';

  var angular = window.angular;
  var io = window.io;

  angular.module('bowerBrowser')
    .factory('SocketService', function ($rootScope) {

      var socket = io();
      var service = {

        // WebSocket receiver
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },

        // WebSocket sender
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          });
        }

      };

      return service;

    });

}(window));
