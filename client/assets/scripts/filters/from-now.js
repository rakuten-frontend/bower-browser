'use strict';

var angular = require('angular');
var moment = require('moment');

angular.module('bowerBrowser')
  .filter('fromNow', function () {

    return function (date) {
      return moment(date).fromNow();
    };

  });
