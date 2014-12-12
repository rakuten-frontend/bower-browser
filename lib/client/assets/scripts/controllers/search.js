(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('SearchController', function ($scope, $state, $timeout, SearchService) {

      var timer;

      // Properties
      $scope.service = SearchService;
      $scope.query = $state.params.q || '';

      // Incremental search with delay
      $scope.$watch('query', function (query, prevQuery) {
        if (query === prevQuery) {
          return;
        }
        if (timer) {
          $timeout.cancel(timer);
        }
        timer = $timeout(function () {
          $state.go('search.results', {q: query, p: null});
        }, 300);
      });

      // Sync input value with query param
      $scope.$on('$stateChangeSuccess', function (event, state, params) {
        $scope.query = params.q || '';
      });

    });

}(window));
