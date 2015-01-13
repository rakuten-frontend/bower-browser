'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('win-spawn');
var _ = require('lodash');
var async = require('async');
var opn = require('opn');
var Gaze = require('gaze').Gaze;
var request = require('request');
var mkdirp = require('mkdirp');

var cwd;
var basename;
var jsonPath;
var io;
var gaze;
var commandQueue;

var apiUrl = 'https://bower-component-list.herokuapp.com/';
var cacheDir = path.join(__dirname, '../cache');
var defaults = {
  path: null,
  port: 3000,
  open: true
};

// Constructor
var BowerBrowser = function (options) {
  var self = this;
  this.fetch(function () {
    var app = require('connect')();
    var server = require('http').Server(app);
    var serveStatic = require('serve-static');

    self.options = _.merge({}, defaults, options);

    // Target project
    cwd = options.path ? path.resolve(options.path) : process.cwd();
    basename = path.basename(cwd);
    jsonPath = path.join(cwd, 'bower.json');
    gaze = new Gaze('bower.json', {cwd: cwd});

    // Start HTTP server
    io = require('socket.io')(server);
    server.listen(self.options.port, 'localhost');
    app.use(serveStatic(path.join(__dirname, 'client')));
    app.use('/api', serveStatic(cacheDir));

    // Queue for sequential command execution
    commandQueue = async.queue(function (data, callback) {
      self.execute(data.command, data.id, callback);
    }, 1);
    commandQueue.drain = function () {
      io.sockets.emit('done');
    };

    // Handle WebSocket
    io.on('connection', function (socket) {
      self.sendBowerData(socket);
      socket.on('execute', function (data) {
        self.register(data.command, data.id);
      });
      socket.on('load', function () {
        self.sendBowerData(socket);
      });
    });

    // Watch bower.json
    gaze.on('all', function () {
      self.sendBowerData();
    });

    console.log('Start bower-browser.');
    if (self.options.open) {
      self.open();
    }
  });
};

// Fetch package list from the Bower registry
BowerBrowser.prototype.fetch = function (callback) {
  var i = 0;
  var processMessage = 'Fetching package list';
  var timer = setInterval(function () {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    i = (i + 1) % 4;
    var dots = new Array(i + 1).join('.');
    process.stdout.write(processMessage + dots);
  }, 500);

  mkdirp.sync(cacheDir);

  request({
    url: apiUrl,
    gzip: true
  }, function () {
    clearInterval(timer);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(processMessage + '... Complete!\n');
    if (typeof callback === 'function') {
      callback();
    }
  })
  .pipe(fs.createWriteStream(path.join(cacheDir, 'bower-component-list.json')));
};

// Open application in browser
BowerBrowser.prototype.open = function () {
  opn('http://localhost:' + this.options.port);
};

// Send bower data to client(s)
BowerBrowser.prototype.sendBowerData = function (socket) {
  this.readBowerJson(function (error, json) {
    var sender = socket || io.sockets;
    var data = {
      name: basename,
      path: cwd
    };
    if (error) {
      data.message = error.toString();
    }
    else {
      data.json = json;
      gaze.add('bower.json');   // Hotfix: watch new created bower.json
    }
    sender.emit('bower', data);
  });
};

// Read bower.json
BowerBrowser.prototype.readBowerJson = function (callback) {
  var json = null;
  var error = null;
  try {
    var buffer = fs.readFileSync(jsonPath);
    json = JSON.parse(buffer);
  } catch (e) {
    error = e;
  }
  if (typeof callback === 'function') {
    callback(error, json);
  }
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
