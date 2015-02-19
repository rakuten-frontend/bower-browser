'use strict';

module.exports = [
  '$scope',
  '$state',
  '$timeout',
  'SearchService',
  function ($scope, $state, $timeout, SearchService) {

    var timer;

    // Properties
    $scope.service = SearchService;
    $scope.query = $state.params.q || '';
    $scope.focus = false;

    // Auto focus on the input field
    $scope.handleFocus = function () {
      if ($scope.service.loaded) {
        $scope.focus = true;
      }
      else {
        $scope.focus = false;
      }
    };

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

    // Events for auto focus
    $scope.$watch('service.loaded', function () {
      $scope.handleFocus();
    });
    $scope.$on('$stateChangeSuccess', function () {
      $scope.handleFocus();
    });

  }
];
