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
          name: 'Home'
        },
        {
          state: 'search.results',
          name: 'Search'
        }
      ];
      $scope.$state = $state;

    });

}(window));
