(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('NavigationController', function ($scope, $state) {

      // Properties
      $scope.templateUrl = '/assets/templates/navigation.html';
      $scope.menus = [
        {
          state: 'home',
          name: 'My project'
        },
        {
          state: 'search.results',
          name: 'Packages'
        }
      ];
      $scope.$state = $state;

    });

}(window));
