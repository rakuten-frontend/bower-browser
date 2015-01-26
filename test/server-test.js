/* jshint mocha: true */
'use strict';

var assert = require('assert');
var http = require('http');
var _ = require('lodash');

var bowerBrowser = require('../lib/');

var baseOptions = {
  path: 'test/fixtures',
  open: false,
  silent: true
};

describe('Server', function () {

  this.timeout(10000);

  it('returns HTTP response', function (done) {
    var app = bowerBrowser(baseOptions);
    app.on('start', function () {
      http.get('http://localhost:3010/', function (res) {
        assert(res.statusCode === 200);
        app.close();
        done();
      });
    });
  });

  it('isn\'t accessible after `close` event', function (done) {
    var app = bowerBrowser(baseOptions);
    app.on('start', function () {
      http.get('http://localhost:3010/', function (res) {
        assert(res.statusCode === 200);
        app.close();
      });
    });
    app.on('close', function () {
      http.get('http://localhost:3010/')
      .on('error', function (error) {
        assert(error.code = 'ECONNRESET');
        done();
      });
    });
  });

  it('listens specified port', function (done) {
    var app = bowerBrowser(_.merge({}, baseOptions, {
      port: 3011
    }));
    app.on('start', function () {
      http.get('http://localhost:3011/', function (res) {
        assert(res.statusCode === 200);
        app.close();
        done();
      });
    });
  });

});
