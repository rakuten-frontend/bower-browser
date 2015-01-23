/* jshint mocha: true */
'use strict';

var assert = require('assert');
var http = require('http');
var bowerBrowser = require('../lib/');

describe('Server', function () {

  it('should return HTTP response', function (done) {
    var app = bowerBrowser({
      open: false,
      silent: true
    });
    app.on('start', function () {
      http.get('http://localhost:3010/', function (res) {
        assert(res.statusCode === 200);
        app.close();
        done();
      });
    });
  });

  it('should listen specified port', function (done) {
    var app = bowerBrowser({
      open: false,
      silent: true,
      port: 3011
    });
    app.on('start', function () {
      http.get('http://localhost:3011/', function (res) {
        assert(res.statusCode === 200);
        app.close();
        done();
      });
    });
  });

});
