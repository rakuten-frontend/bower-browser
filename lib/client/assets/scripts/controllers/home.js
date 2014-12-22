(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('HomeController', function ($scope, BowerService) {

      // Properties
      $scope.bower = BowerService;

    });

}(window));
