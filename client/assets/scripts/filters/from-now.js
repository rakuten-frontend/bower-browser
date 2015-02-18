(function (window) {
  'use strict';

  var angular = window.angular;
  var moment = window.moment;

  angular.module('bowerBrowser')
    .filter('fromNow', function () {

      return function (date) {
        return moment(date).fromNow();
      };

    });

}(window));
