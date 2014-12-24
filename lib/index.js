'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('win-spawn');
var opn = require('opn');
var Gaze = require('gaze').Gaze;

var cwd = process.cwd();
var jsonPath = path.join(cwd, 'bower.json');
var io;

// Constructor
var BowerBrowser = function (options) {
  this.options = options;
};

// Start HTTP server
BowerBrowser.prototype.start = function () {
  var self = this;
  var app = require('connect')();
  var server = require('http').Server(app);
  var serveStatic = require('serve-static');
  var gaze = new Gaze(jsonPath);

  io = require('socket.io')(server);
  server.listen(this.options.port, 'localhost');
  app.use(serveStatic(path.join(__dirname, 'client')));

  if (this.options.open) {
    this.open();
  }

  // Handle WebSocket
  io.on('connection', function (socket) {
    socket.emit('bowerJson', self.getBowerJson());
    socket.on('execute', function (command) {
      self.execute(command);
    });
  });

  // Watch bower.json
  gaze.on('all', function () {
    io.sockets.emit('bowerJson', self.getBowerJson());
  });

  return this;
};

// Open application in browser
BowerBrowser.prototype.open = function () {
  opn('http://localhost:' + this.options.port);
  return this;
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

// Execute command
BowerBrowser.prototype.execute = function (input) {
  var self = this;
  var inputArray = input.trim().split(/\s+/);
  var command = inputArray.shift();
  var args = inputArray;
  var options = {
    cwd: cwd,
    env: process.env
  };
  var child = spawn(command, args, options);

  io.sockets.emit('exec', input);
  this.log('\n$ ' + input + '\n');

  child.stdout.on('data', function (data) {
    self.log(data.toString());
  });
  child.on('close', function (code) {
    io.sockets.emit('close', code);
  });
};

// Log to stdout and socket
BowerBrowser.prototype.log = function (message) {
  process.stdout.write(message);
  io.sockets.emit('log', message);
};

// Module entry point
module.exports = function (options) {
  return new BowerBrowser(options).start();
};

// Export for advanced usage
module.exports.BowerBrowser = BowerBrowser;
