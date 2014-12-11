(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;
  var moment = window.moment;

  angular.module('bowerBrowser')
    .controller('SearchController', function ($scope, $location, $timeout, BowerService, ProcessService, SearchService) {

      var timer;

      // Properties
      $scope.service = SearchService;
      $scope.query = $scope.service.query;

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

      // Formant date
      $scope.timeago = function (date) {
        return moment(date).fromNow();
      };

      // Got to previous page
      $scope.goPrev = function () {
        $scope.service.goPrev();
      };

      // Go to next page
      $scope.goNext = function () {
        $scope.service.goNext();
      };

      // Sort component list by field
      $scope.sortBy = function (field) {
        if (!$scope.service.loaded) {
          return;
        }
        $scope.service.sortBy(field);
      };

      // Return class name according to the sort setting
      $scope.getSortedClass = function (field) {
        var className = '';
        if ($scope.service.sortField === field) {
          className = $scope.service.sortReverse ? 'sort-descend' : 'sort-ascend';
        }
        return className;
      };

      // Search by current params
      $scope.search = function () {
        var params = $location.search();
        $scope.service.query = params.q || '';
        if (!$scope.service.loaded) {
          $scope.service.loadComponents();
        }
        else {
          $scope.service.search();
        }
      };

      // Sync query value with service
      $scope.$watch('service.query', function (query) {
        $scope.query = query;
      });

      $scope.$watch('query', function (query) {
        if (timer) {
          $timeout.cancel(timer);
        }
        timer = $timeout(function () {
          var q = query || null;
          $location.search('q', q);
        }, 300);
      });

      // Events when param is changed
      $scope.$on('$locationChangeSuccess', function () {
        $scope.search();
      });

      // Initialize
      $scope.search();

    });

}(window));
