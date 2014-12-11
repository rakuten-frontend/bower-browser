(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;
  var moment = window.moment;
  var socket = window.io('http://localhost');

  var ignore = window.ignore;
  var whitelist = window.whitelist;

  var api = 'https://bower-component-list.herokuapp.com/';

  angular

    .module('app.controllers.home', [
      'angular-loading-bar',
      'app.services.process'
    ])

    .controller('HomeController', function ($scope, $http, $timeout, ProcessService) {

      var timer;

      // Properties
      $scope.bower = {};
      $scope.components = [];
      $scope.list = [];
      $scope.results = [];
      $scope.searching = false;
      $scope.loaded = false;
      $scope.loadingError = false;
      $scope.page = 1;
      $scope.count = 0;
      $scope.pageCount = 1;
      $scope.limit = 30;
      $scope.sortField = '';
      $scope.sortReverse = false;
      $scope.query = '';

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
        return _.has($scope.bower.dependencies, name);
      };

      // Get installed version
      $scope.getVersion = function (name) {
        return $scope.bower.dependencies[name];
      };

      // Formant date
      $scope.timeago = function (date) {
        return moment(date).fromNow();
      };

      // Load component list
      $scope.loadComponents = function () {
        $scope.searching = true;
        $scope.loadingError = false;
        $scope.getComponents().success(function (data) {
          $scope.components = data;
          $scope.list = $scope.components;
          $scope.loaded = true;
          $scope.resetResults();
        });
      };

      // Reset list to the default setting
      $scope.resetResults = function () {
        $scope.sortField = 'stars';
        $scope.sortReverse = true;
        $scope.query = '';
        $scope.search();
      };

      // Get component list from API
      $scope.getComponents = function () {
        return $http.get(api)
          .success(function (res) {
            $scope.searching = false;
            return res.data;
          })
          .error(function () {
            $scope.searching = false;
            $scope.loadingError = true;
            return false;
          });
      };

      // Update results to show
      $scope.updateResults = function () {
        var from = ($scope.page - 1) * $scope.limit;
        var to = from + $scope.limit;
        $scope.results = $scope.list.slice(from, to);
      };

      // Got to previous page
      $scope.goPrev = function () {
        if ($scope.hasPrev()) {
          $scope.page--;
          $scope.updateResults();
        }
      };

      // Go to next page
      $scope.goNext = function () {
        if ($scope.hasNext()) {
          $scope.page++;
          $scope.updateResults();
        }
      };

      // Has previous page or not
      $scope.hasPrev = function () {
        return $scope.page > 1;
      };

      // Has next page or not
      $scope.hasNext = function () {
        return $scope.page < $scope.pageCount;
      };

      // Sort component list according to the current condition
      $scope.sort = function () {
        var list = _.sortBy($scope.list, function (item) {
          return item[$scope.sortField];
        });
        if ($scope.sortReverse) {
          list = list.reverse();
        }
        $scope.list = list;
      };

      // Sort component list by field
      $scope.sortBy = function (field) {
        if (!$scope.loaded) {
          return;
        }
        if (field === $scope.sortField) {
          $scope.sortReverse = !$scope.sortReverse;
        }
        else {
          $scope.sortField = field;
          $scope.sortReverse = false;
        }
        $scope.sort();
        $scope.updateResults();
      };

      // Return class name according to the sort setting
      $scope.getSortedClass = function (field) {
        var className = '';
        if ($scope.sortField === field) {
          className = $scope.sortReverse ? 'sort-descend' : 'sort-ascend';
        }
        return className;
      };

      // Search components using current condition
      $scope.search = function () {
        var query = $scope.query;
        var list = _.filter($scope.components, function (item) {
          if (ignore.indexOf(item.name) !== -1) {
            return false;
          }
          if (_.isString(item.website) && typeof whitelist[item.website] !== 'undefined') {
            if (item.name !== whitelist[item.website]) {
              return false;
            }
          }
          if (query === '') {
            return true;
          }
          if (item.name.indexOf(query.toLowerCase()) !== -1 ||
              (item.description && item.description.indexOf(query.toLowerCase()) !== -1) ||
              item.owner.indexOf(query.toLowerCase()) !== -1) {
            return true;
          }
          return false;
        });
        $scope.list = list;
        $scope.page = 1;
        $scope.count = $scope.list.length;
        $scope.pageCount = Math.ceil($scope.count / $scope.limit);
        $scope.sort();
        $scope.updateResults();
      };

      // Handle WebSocket
      socket.on('bowerJson', function (data) {
        $scope.bower = data;
        $scope.$apply();
      });

      // Interactions
      $scope.$watch('query', function () {
        if (timer) {
          $timeout.cancel(timer);
        }
        timer = $timeout(function () {
          $scope.search();
        }, 300);
      });

      // Initialize
      if (!$scope.loaded) {
        $scope.loadComponents();
      }
      else {
        $scope.resetResults();
      }

    });

}(window));
