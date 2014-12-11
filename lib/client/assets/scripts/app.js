(function (window) {
  'use strict';

  var angular = window.angular;

  angular
    .module('bowerBrowser', [
      'ui.router',
      'angular-loading-bar'
    ])
    .config(function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {

      // Redirect
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
          controller: 'SearchController',
          reloadOnSearch: false
        });

      // Hide spinner of angular-loading-bar
      cfpLoadingBarProvider.includeSpinner = false;

    });

}(window));
