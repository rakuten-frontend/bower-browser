'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('win-spawn');
var opn = require('opn');

// Constructor
var BowerBrowser = function (options) {
  this.options = options;
};

// Start HTTP server
BowerBrowser.prototype.start = function () {
  var app = require('connect')();
  var server = require('http').Server(app);
  var serveStatic = require('serve-static');
  var io = require('socket.io')(server);
  var Gaze = require('gaze').Gaze;

  var cwd = process.cwd();
  var jsonPath = path.join(cwd, 'bower.json');
  var gaze = new Gaze(jsonPath);

  server.listen(this.options.port, 'localhost');
  app.use(serveStatic(path.join(__dirname, 'assets')));
  app.use('/node_modules', serveStatic(path.join(__dirname, '../node_modules')));

  if (this.options.open) {
    this.open();
  }

  // Handle WebSocket
  io.on('connection', function (socket) {

    socket.emit('bowerJson', getBowerJson());

    gaze.on('all', function () {
      socket.emit('bowerJson', getBowerJson());
    });

    socket.on('execute', function (command) {
      execute(command);
    });

    // Return bower.json content as Object
    function getBowerJson() {
      var json;
      try {
        var buffer = fs.readFileSync(jsonPath);
        json = JSON.parse(buffer);
      } catch (e) {
        json = {};
      }
      return json;
    }

    // Execute command
    function execute (command) {
      var inputArray = command.trim().split(/\s+/);
      var cmd = inputArray.shift();
      var args = inputArray;
      var options = {
        cwd: cwd,
        env: process.env
      };
      var child = spawn(cmd, args, options);
      process.stdout.write('\n$ ' + command + '\n');
      child.stdout.on('data', function (data) {
        var message = data.toString();
        process.stdout.write(message);
        socket.emit('log', message);
      });
    }

  });
  return this;
};

// Open application in browser
BowerBrowser.prototype.open = function () {
  opn('http://localhost:' + this.options.port);
  return this;
};

// Module entry point
module.exports = function (options) {
  return new BowerBrowser(options).start();
};

// For advanced users
module.exports.BowerBrowser = BowerBrowser;
