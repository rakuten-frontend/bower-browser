'use strict';

module.exports = [
  '$scope',
  '$state',
  'SearchService',
  function ($scope, $state, SearchService) {

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

    // Incremental search
    $scope.$watch('query', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $state.go('search.results', {q: newValue, p: null});
      }
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
