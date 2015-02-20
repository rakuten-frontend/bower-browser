'use strict';

var fs = require('fs');

module.exports = [
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$uiViewScrollProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {

    // Redirects
    $urlRouterProvider.when('/search', '/search/');
    $urlRouterProvider.otherwise('/');

    // Routes
    $stateProvider
      .state('home', {
        url: '/',
        template: fs.readFileSync(__dirname + '/../templates/home.html', 'utf8'),
        controller: 'HomeController'
      })
      .state('search', {
        url: '/search',
        template: fs.readFileSync(__dirname + '/../templates/search.html', 'utf8'),
        controller: 'SearchController'
      })
      .state('search.results', {
        url: '/?q&p&s&o',
        template: fs.readFileSync(__dirname + '/../templates/search-results.html', 'utf8'),
        controller: 'SearchResultsController'
      });

    // Use # url
    $locationProvider.html5Mode(false);

    // Use $anchorScroll behavior for ui-view
    $uiViewScrollProvider.useAnchorScroll();

  }
];
