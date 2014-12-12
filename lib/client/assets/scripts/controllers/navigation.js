(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('NavigationController', function ($scope, $state) {

      // Properties
      $scope.templateUrl = '/assets/templates/navigation.html';
      $scope.menus = [
        {
          id: 'home',
          title: 'Home'
        },
        {
          id: 'search.results',
          title: 'Search'
        }
      ];
      $scope.$state = $state;

    });

}(window));
