(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app.controllers.home', [
      'app.services.bower',
      'app.services.process'
    ])

    .controller('HomeController', function ($scope, BowerService, ProcessService) {

      // Properties
      $scope.bower = BowerService;

      // Install component
      $scope.install = function (name, version) {
        var target = name;
        if (typeof version !== 'undefined' && version !== '') {
          target = target + '#' + version;
        }
        ProcessService.execute('bower install --save ' + target);
      };

      // Uninstall component
      $scope.uninstall = function (name) {
        ProcessService.execute('bower uninstall --save ' + name);
      };

    });

}(window));
