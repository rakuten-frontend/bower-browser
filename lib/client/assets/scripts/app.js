(function (window) {
  'use strict';

  var angular = window.angular;

  angular

    .module('app', [
      'ui.router',
      'angular-loading-bar',
      'app.controllers.home',
      'app.controllers.search',
      'app.controllers.console',
      'app.controllers.navigation'
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
          controller: 'SearchController'
        });

      // Hide spinner of angular-loading-bar
      cfpLoadingBarProvider.includeSpinner = false;

    });

}(window));
