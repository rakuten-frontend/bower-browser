(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;
  var moment = window.moment;

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

      // Format date
      $scope.timeago = function (date) {
        return moment(date).fromNow();
      };

      // Has previous page or not
      $scope.hasPrev = function () {
        return $scope.service.page > 1;
      };

      // Has next page or not
      $scope.hasNext = function () {
        return $scope.service.page < $scope.service.pageCount;
      };

      // Get current sort name
      $scope.getSortName = function () {
        var sort = _.find($scope.sorts, function (sort) {
          return sort.params.s === $scope.service.sorting && sort.params.o === $scope.service.order;
        });
        return sort.name;
      };

      // Return class name according to the sort setting
      $scope.getSortedClass = function (field) {
        var className = '';
        if ($scope.service.sorting === field) {
          className = 'sort-' + $scope.service.order;
        }
        return className;
      };

      // Sort by field
      $scope.sortBy = function (field) {
        var params = {
          p: null
        };
        if (!$scope.service.loaded) {
          return;
        }
        if (field === $scope.service.sorting) {
          params.o = $scope.service.order === 'desc' ? 'asc' : 'desc';
        }
        else {
          params.s = field;
          switch (field) {
            case 'name':
            case 'owner':
              params.o = 'asc';
              break;
            default:
              params.o = 'desc';
          }
        }
        $state.go('search.results', params);
      };

      // Initialize
      $scope.service.setParams($state.params);

    });

}(window));
