(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;

  angular.module('bowerBrowser')
    .controller('SearchResultsController', function ($scope, $state, BowerService, ProcessService, SearchService) {

      // Properties
      $scope.service = SearchService;
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

      // Check installation
      $scope.isInstalled = function (name) {
        return _.has(BowerService.json.dependencies, name);
      };

      // Get installed version
      $scope.getVersion = function (name) {
        return BowerService.json.dependencies[name];
      };

      // Get current sort name
      $scope.getSortName = function () {
        var sort = _.find($scope.sorts, function (sort) {
          return sort.params.s === $scope.service.sorting && sort.params.o === $scope.service.order;
        });
        return sort.name;
      };

      // Initialize
      $scope.service.setParams($state.params);

    });

}(window));
