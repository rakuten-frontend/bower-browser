(function (window) {
  'use strict';

  var angular = window.angular;
  var socket = window.io('http://localhost');

  angular

    .module('app.services.bower', [
    ])

    .factory('BowerService', function ($timeout) {

      var service = {

        // bower.json data
        json: {}

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
