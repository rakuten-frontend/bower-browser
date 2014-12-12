(function (window) {
  'use strict';

  var angular = window.angular;

  angular.module('bowerBrowser')
    .controller('SearchController', function ($scope, $state, $timeout, SearchService) {

      var timer;

      // Properties
      $scope.service = SearchService;
      $scope.query = $scope.service.query;

      // Got to previous page
      $scope.goPrev = function () {
        $scope.service.goPrev();
      };

      // Go to next page
      $scope.goNext = function () {
        $scope.service.goNext();
      };

      // Sync query value with service
      $scope.$watch('service.query', function (query) {
        $scope.query = query;
      });

      // Incremental search with delay
      $scope.$watch('query', function (query) {
        if (timer) {
          $timeout.cancel(timer);
        }
        timer = $timeout(function () {
          $state.go('search.results', {q: query});
        }, 300);
      });

    });

}(window));
