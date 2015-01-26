'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var path = require('path');
var fs = require('fs');
var spawn = require('win-spawn');
var _ = require('lodash');
var async = require('async');
var opn = require('opn');
var Gaze = require('gaze').Gaze;
var request = require('request');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

var cwd;
var basename;
var jsonPath;
var server;
var io;
var gaze;
var commandQueue;

var apiUrl = 'https://bower-component-list.herokuapp.com/';
var cacheDir = path.join(__dirname, '../cache');
var cacheFile = path.join(cacheDir, 'bower-component-list.json');
var defaults = {
  path: null,
  port: 3010,
  cache: 86400,   // 86400s = 24hours
  open: true,
  silent: false
};

// Constructor
var BowerBrowser = function (options) {
  var self = this;

  EventEmitter.call(this);

  this.options = _.merge({}, defaults, options);
  this.running = false;

  if (this.options.cache === 0 || !this.hasApiCache()) {
    this.fetch(function () {
      self.start();
    });
  }
  else {
    // Start server after the constructor
    setTimeout(function () {
      self.start();
    }, 0);
  }
};

// Inherit EventEmitter
util.inherits(BowerBrowser, EventEmitter);

// Start server
BowerBrowser.prototype.start = function () {
  var self = this;
  var app = require('connect')();
  var serveStatic = require('serve-static');

  // Target project
  cwd = this.options.path ? path.resolve(this.options.path) : process.cwd();
  basename = path.basename(cwd);
  jsonPath = path.join(cwd, 'bower.json');

  // Start HTTP server
  server = require('http').Server(app);
  io = require('socket.io')(server);
  server.listen(this.options.port, 'localhost');
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

  this.running = true;
  this.print('Started bower-browser on ' + chalk.magenta('http://localhost:' + this.options.port) + '\n');
  this.emit('start');
  if (this.options.open) {
    this.open();
  }
};

// Fetch package list from the Bower registry
BowerBrowser.prototype.fetch = function (callback) {
  var self = this;
  var i = 0;
  var processMessage = 'Fetching package list';
  var timer;

  if (!this.options.silent) {
    timer = setInterval(function () {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      i = (i + 1) % 4;
      var dots = new Array(i + 1).join('.');
      process.stdout.write(processMessage + dots);
    }, 500);
  }

  mkdirp.sync(cacheDir);

  request({
    url: apiUrl,
    gzip: true
  }, function (error) {
    if (!self.options.silent) {
      clearInterval(timer);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(processMessage + '... ');
    }
    if (error) {
      self.print(chalk.red('Error!') + '\n\nCouldn\'t fetch package list from the Bower registry.\nPlease try again later.\n');
      return;
    }
    self.print(chalk.green('Complete!\n'));
    if (typeof callback === 'function') {
      callback();
    }
  })
  .pipe(fs.createWriteStream(cacheFile));
};

// API cache is effective or not
BowerBrowser.prototype.hasApiCache = function () {
  var cached;
  var stat;
  try {
    stat = fs.statSync(cacheFile);
    cached = new Date() - stat.mtime < this.options.cache * 1000;
  } catch (e) {
    cached = false;
  }
  return cached;
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
    }
    sender.emit('bower', data);
  });
};

// Read and watch bower.json
BowerBrowser.prototype.readBowerJson = function (callback) {
  var self = this;
  var json = null;
  var error = null;
  try {
    var buffer = fs.readFileSync(jsonPath);
    if (!gaze) {
      gaze = new Gaze('bower.json', {cwd: cwd});
      gaze.on('all', function () {
        self.sendBowerData();
      });
    }
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
  this.log('\n> ' + input + '\n');

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
  this.print(message);
  io.sockets.emit('log', message);
  this.emit('log', message);
};

// Print to stdout unless `--silent`
BowerBrowser.prototype.print = function (data) {
  if (!this.options.silent) {
    process.stdout.write(data);
  }
};

// Stop server and wathcers
BowerBrowser.prototype.close = function () {
  if (this.running) {
    if (gaze) {
      gaze.close();
    }
    if (io) {
      io.close();
    }
    this.running = false;
  }
  this.print('\nClosed bower-browser\n');
  this.emit('close');
};

// Module entry point
module.exports = function (options) {
  return new BowerBrowser(options);
};
