'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('win-spawn');
var _ = require('lodash');
var async = require('async');
var opn = require('opn');
var Gaze = require('gaze').Gaze;

var cwd;
var jsonPath;
var io;
var gaze;
var commandQueue;

var defaults = {
  path: null,
  port: 3000,
  open: true
};

// Constructor
var BowerBrowser = function (options) {
  var self = this;
  var app = require('connect')();
  var server = require('http').Server(app);
  var serveStatic = require('serve-static');

  this.options = _.merge({}, defaults, options);

  // Target project
  cwd = options.path ? path.resolve(options.path) : process.cwd();
  jsonPath = path.join(cwd, 'bower.json');
  gaze = new Gaze(jsonPath);

  // Start HTTP server
  io = require('socket.io')(server);
  server.listen(this.options.port, 'localhost');
  app.use(serveStatic(path.join(__dirname, 'client')));

  // Queue for sequential command execution
  commandQueue = async.queue(function (data, callback) {
    self.execute(data.command, data.id, callback);
  }, 1);
  commandQueue.drain = function () {
    io.sockets.emit('done');
  };

  // Handle WebSocket
  io.on('connection', function (socket) {
    socket.emit('bowerJson', self.getBowerJson());
    socket.on('execute', function (data) {
      self.register(data.command, data.id);
    });
  });

  // Watch bower.json
  gaze.on('all', function () {
    io.sockets.emit('bowerJson', self.getBowerJson());
  });

  if (this.options.open) {
    this.open();
  }
};

// Open application in browser
BowerBrowser.prototype.open = function () {
  opn('http://localhost:' + this.options.port);
};

// Get bower.json data
BowerBrowser.prototype.getBowerJson = function () {
  var json;
  try {
    var buffer = fs.readFileSync(jsonPath);
    json = JSON.parse(buffer);
  } catch (e) {
    json = {};
  }
  return json;
};

// Register command to queue
BowerBrowser.prototype.register = function (command, id) {
  id = id || '';
  commandQueue.push({
    command: command,
    id: id
  });
  io.sockets.emit('added', id);
};

// Execute command
BowerBrowser.prototype.execute = function (input, id, callback) {
  var self = this;
  var inputArray = input.trim().split(/\s+/);
  var command = inputArray.shift();
  var args = inputArray;
  var options = {
    cwd: cwd,
    env: process.env
  };
  var child = spawn(command, args, options);

  io.sockets.emit('start', id);
  this.log('\n$ ' + input + '\n');

  child.stdout.on('data', function (data) {
    self.log(data.toString());
  });
  child.stderr.on('data', function (data) {
    self.log(data.toString());
  });
  child.on('exit', function () {
    io.sockets.emit('end', id);
    if (callback) {
      callback();
    }
  });
};

// Log to stdout and socket
BowerBrowser.prototype.log = function (message) {
  process.stdout.write(message);
  io.sockets.emit('log', message);
};

// Module entry point
module.exports = function (options) {
  return new BowerBrowser(options);
};
