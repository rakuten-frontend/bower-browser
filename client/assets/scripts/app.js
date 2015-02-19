'use strict';

var angular = require('angular');

require('bootstrap');

angular
  .module('bowerBrowser', [
    require('angular-ui-router'),
    require('angular-scroll')
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

require('./controllers/home');
require('./controllers/search');
require('./controllers/search-results');
require('./controllers/console');
require('./services/socket');
require('./services/bower');
require('./services/process');
require('./services/search');
require('./directives/pagination');
require('./directives/focus');
require('./directives/scroll');
require('./filters/from-now');
