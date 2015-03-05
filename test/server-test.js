/* jshint mocha: true */
'use strict';

var assert = require('assert');
var request = require('request');
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
      request('http://localhost:3010/', function (error, res) {
        assert.equal(res.statusCode, 200);
        app.close();
        done();
      });
    });
  });

  it('isn\'t accessible after `close` event', function (done) {
    var app = bowerBrowser(baseOptions);
    app.on('start', function () {
      request('http://localhost:3010/', function (error, res) {
        assert.equal(res.statusCode, 200);
        app.close();
      });
    });
    app.on('close', function () {
      request('http://localhost:3010/', function (error) {
        assert(error);
        done();
      });
    });
  });

  it('listens specified port', function (done) {
    var app = bowerBrowser(_.merge({}, baseOptions, {
      port: 3011
    }));
    app.on('start', function () {
      request('http://localhost:3011/', function (error, res) {
        assert.equal(res.statusCode, 200);
        app.close();
        done();
      });
    });
  });

  it('fetches API and returns json', function (done) {
    this.timeout(20000);
    var app = bowerBrowser(_.merge({}, baseOptions, {
      cache: 0
    }));
    app.on('start', function () {
      request('http://localhost:3010/api/bower-component-list.json', function (error, res, body) {
        var data;
        var isJson;
        assert.equal(res.statusCode, 200);
        try {
          data = JSON.parse(body);
          isJson = typeof data === 'object' && data !== null;
        }
        catch (e) {
          isJson = false;
        }
        assert(isJson);
        app.close();
        done();
      });
    });
  });

});
