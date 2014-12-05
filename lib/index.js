'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var app = require('connect')();
var server = require('http').Server(app);
var serveStatic = require('serve-static');
var io = require('socket.io')(server);
var Gaze = require('gaze').Gaze;
var opn = require('opn');

var cwd = process.cwd();
var jsonPath = path.join(cwd, 'bower.json');
var gaze = new Gaze(jsonPath);

var bowerBrowser = {

  // Start HTTP server
  start: function () {
    server.listen(3000, 'localhost');
    app.use(serveStatic(path.join(__dirname, 'assets')));
    app.use('/node_modules', serveStatic(path.join(__dirname, '../node_modules')));

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
        var child = spawn(cmd, args);
        process.stdout.write('\n$ ' + command + '\n');
        child.stdout.on('data', function (data) {
          var message = data.toString();
          process.stdout.write(message);
          socket.emit('log', message);
        });
      }

    });
    return this;
  },

  // Open bower-browser
  open: function () {
    opn('http://localhost:3000');
    return this;
  }

};

module.exports = bowerBrowser;
