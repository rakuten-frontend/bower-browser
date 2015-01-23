/* jshint mocha: true */
'use strict';

var assert = require('assert');
var http = require('http');
var bowerBrowser = require('../lib/');

describe('Server', function () {

  it('should return HTTP response', function (done) {
    var app = bowerBrowser({open: false});
    app.on('start', function () {
      http.get('http://localhost:3010/', function (res) {
        assert(res.statusCode === 200);
        done();
      });
    });
  });

});
