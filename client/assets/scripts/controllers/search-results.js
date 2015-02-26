'use strict';

var _ = require('lodash');

module.exports = [
  '$scope',
  '$state',
  'BowerService',
  'ProcessService',
  'SearchService',
  'SettingsService',
  function ($scope, $state, BowerService, ProcessService, SearchService, SettingsService) {

    // Properties
    $scope.service = SearchService;
    $scope.bower = BowerService;
    $scope.process = ProcessService;
    $scope.config = SettingsService.config;
    $scope.sorts = [
      {
        name: 'Most stars',
        params: {s: 'stars', o: 'desc', p: null}
      },
      {
        name: 'Fewest stars',
        params: {s: 'stars', o: 'asc', p: null}
      },
      {
        name: 'Package name',
        params: {s: 'name', o: 'asc', p: null}
      },
      {
        name: 'Package name (desc)',
        params: {s: 'name', o: 'desc', p: null}
      },
      {
        name: 'Owner name',
        params: {s: 'owner', o: 'asc', p: null}
      },
      {
        name: 'Owner name (desc)',
        params: {s: 'owner', o: 'desc', p: null}
      },
      {
        name: 'Recently updated',
        params: {s: 'updated', o: 'desc', p: null}
      },
      {
        name: 'Least recently updated',
        params: {s: 'updated', o: 'asc', p: null}
      }
    ];

    // Get current sort name
    $scope.getSortName = function () {
      var sort = _.find($scope.sorts, function (sort) {
        return sort.params.s === $scope.service.sorting && sort.params.o === $scope.service.order;
      });
      return sort.name;
    };

    // Initialize
    $scope.service.setParams($state.params);

  }
];
