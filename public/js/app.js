(function () {
  'use strict';

  var angular = window.angular;
  var _ = window._;
  var moment = window.moment;
  var socket = window.io('http://localhost');

  var api = [
    {
      "name": "bootstrap",
      "description": "The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.",
      "owner": "twbs",
      "website": "https://github.com/twbs/bootstrap",
      "forks": 28439,
      "stars": 75033,
      "created": "2011-07-29T21:19:00Z",
      "updated":"2014-12-03T07:20:29Z"
    },
    {
      "name": "jquery",
      "description": "jQuery JavaScript Library",
      "owner": "jquery",
      "website": "https://github.com/jquery/jquery",
      "forks": 7620,
      "stars": 32694,
      "created": "2009-04-03T15:20:14Z",
      "updated":"2014-12-03T21:05:42Z"
    },
    {
      "name": "moment",
      "description": "Parse, validate, manipulate, and display dates in javascript.",
      "owner": "moment",
      "website": "https://github.com/moment/moment",
      "forks": 1911,
      "stars": 18741,
      "created": "2011-03-01T02:46:06Z",
      "updated":"2014-12-01T07:58:15Z"
    },
    {
      "name": "normalize.css",
      "description": "A collection of HTML element and attribute style-normalizations",
      "owner": "necolas",
      "website": "https://github.com/necolas/normalize.css",
      "forks": 3093,
      "stars": 14582,
      "created": "2011-05-04T10:20:25Z",
      "updated":"2014-10-06T16:07:47Z"
    }
  ];

  angular.module('bowerBrowser', [])

    .controller('LibraryController', ['$scope', '$sce', function ($scope, $sce) {

      // Properties
      $scope.bower = {};
      $scope.log = 'Welcome to bower-browser Demo!\n';
      $scope.logHtml = $sce.trustAsHtml($scope.log);
      $scope.results = api;

      // Install component
      $scope.install = function (name, version) {
        var target = name;
        if (typeof version !== 'undefined' && version !== '') {
          target = target + '#' + version;
        }
        $scope.execute('bower install --save ' + target);
      };

      // Uninstall component
      $scope.uninstall = function (name) {
        $scope.execute('bower uninstall --save ' + name);
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

      // Execute command
      $scope.execute = function (command) {
        $scope.pushLog('\n$ ' + command + '\n');
        socket.emit('execute', command);
      };

      // Handle WebSocket
      socket.on('bowerJson', function (data) {
        $scope.bower = data;
        $scope.$apply();
      });

      // Log
      $scope.pushLog = function (message) {
        $scope.log = $scope.log + message;
        $scope.logHtml = $sce.trustAsHtml($scope.log);
      };
      socket.on('log', function (message) {
        $scope.pushLog(message);
      });

    }]);

}(window));
