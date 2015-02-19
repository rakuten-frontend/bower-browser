'use strict';

var moment = require('moment');

module.exports = [
  function () {

    return function (date) {
      return moment(date).fromNow();
    };

  }
];
