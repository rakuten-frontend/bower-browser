'use strict';

var angular = require('angular');

require('bootstrap-sass');

angular
  .module('bowerBrowser', [
    require('angular-ui-router'),
    require('angular-scroll')
  ])
  .config(require('./config'))
  .controller('HomeController', require('./controllers/home'))
  .controller('SearchController', require('./controllers/search'))
  .controller('SearchResultsController', require('./controllers/search-results'))
  .controller('SettingsController', require('./controllers/settings'))
  .controller('ConsoleController', require('./controllers/console'))
  .controller('PaginationController', require('./controllers/pagination'))
  .factory('SocketService', require('./services/socket'))
  .factory('BowerService', require('./services/bower'))
  .factory('ProcessService', require('./services/process'))
  .factory('SearchService', require('./services/search'))
  .factory('SettingsService', require('./services/settings'))
  .directive('appConsole', require('./directives/console'))
  .directive('appPagination', require('./directives/pagination'))
  .directive('appPopover', require('./directives/popover'))
  .directive('appFocus', require('./directives/focus'))
  .directive('appScroll', require('./directives/scroll'))
  .filter('fromNow', require('./filters/from-now'));
