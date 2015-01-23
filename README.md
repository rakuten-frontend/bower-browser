# bower-browser

> Browser-based GUI manager of Bower.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]

![bower-browser](resources/screenshot.png)

## Features
* Search from Bower registry
* Install packages with various options
* Realtime log
* Display bower.json data
* Update or uninstall local Bower components

## Installation

```shell
$ npm install -g bower-browser
```

## Usage

```shell
$ cd path/to/your-project
$ bower-browser
```

Then, web browser will open `http://localhost:3010` automatically.  
Manage your Bower components in the web GUI! :-)

### CLI Options
* `--path <directory>`  
  Location of bower.json. (default: use `process.cwd()`)

* `--port <number>`  
  Port number of bower-browser server. (default: `3010`)

* `--cache <seconds>`  
  Cache TTL for package list API. Set `0` to force to fetch API. (default: `86400` = 24hours)

* `--skip-open`  
  Prevent opening web browser at the start.

* `--silent`  
  Print nothing to stdout.

* `-h`, `--help`  
  Output usage information.

* `-V`, `--version`  
  Output the version number.

## API

```javascript
var bowerBrowser = require('bower-browser');

// Start the application with default config.
bowerBrowser();

// Or start with options you like.
bowerBrowser({
  path: 'path/to/project',  // Location of bower.json. default: null (use process.cwd())
  port: 8080,               // Port number. default: 3010
  cache: 0,                 // Cache TTL. Set 0 to force to fetch API. default: 86400 (24hrs)
  open: false,              // Prevent opening browser. default: true (open automatically)
  silent: true              // Print nothing to stdout. default: false
});
```

## License
Copyright (c) 2014-2015 Rakuten, Inc. Licensed under the [MIT License](LICENSE).

[npm-image]: https://img.shields.io/npm/v/bower-browser.svg?style=flat
[npm-url]: https://www.npmjs.com/package/bower-browser
[travis-image]: https://img.shields.io/travis/rakuten-frontend/bower-browser/master.svg?style=flat
[travis-url]: https://travis-ci.org/rakuten-frontend/bower-browser
[deps-image]: http://img.shields.io/david/rakuten-frontend/bower-browser.svg?style=flat
[deps-url]: https://david-dm.org/rakuten-frontend/bower-browser
