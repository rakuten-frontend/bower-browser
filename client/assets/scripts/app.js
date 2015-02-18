(function (window) {
  'use strict';

  var angular = window.angular;

  angular
    .module('bowerBrowser', [
      'ui.router',
      'duScroll'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {

      // Redirects
      $urlRouterProvider.when('/search', '/search/');
      $urlRouterProvider.otherwise('/');

      // Routes
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/assets/templates/home.html',
          controller: 'HomeController'
        })
        .state('search', {
          url: '/search',
          templateUrl: '/assets/templates/search.html',
          controller: 'SearchController'
        })
        .state('search.results', {
          url: '/?q&p&s&o',
          templateUrl: '/assets/templates/search-results.html',
          controller: 'SearchResultsController'
        });

      // Use # url
      $locationProvider.html5Mode(false);

      // Use $anchorScroll behavior for ui-view
      $uiViewScrollProvider.useAnchorScroll();

    });

}(window));
