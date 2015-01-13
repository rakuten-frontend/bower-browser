# bower-browser [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][deps-image]][deps-url]

> Browser-based GUI for managing Bower components.

## Installation

```shell
$ npm install -g bower-browser
```

## Usage

```shell
$ cd path/to/your-project
$ bower-browser
```

Then, web browser will open `http://localhost:3000` automatically.  
Manage your Bower components in the web GUI! :-)

### CLI Options
* `--path <directory>`  
  Location of bower.json. (default: cwd)

* `--port <number>`  
  Port number of bower-browser server. (default: `3000`)

* `--cache <number>`  
  Cache TTL for package list API. Measured in seconds. (default: `86400` = 24hours)

* `--skip-open`  
  Prevent opening your browser at the start.

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
  port: 8080,               // Port number. default: 3000
  cache: 0,                 // Cache TTL. Set 0 to force to fetch API. default: 86400 (24hrs)
  open: false               // Prevent opening browser. default: true (open automatically)
});
```

## License
Copyright (c) 2014-2015 Rakuten, Inc. Licensed under the [MIT License](LICENSE).

[npm-image]: https://img.shields.io/npm/v/bower-browser.svg?style=flat
[npm-url]: https://www.npmjs.org/package/bower-browser
[travis-image]: https://img.shields.io/travis/rakuten-frontend/bower-browser/master.svg?style=flat
[travis-url]: https://travis-ci.org/rakuten-frontend/bower-browser
[deps-image]: http://img.shields.io/david/rakuten-frontend/bower-browser.svg?style=flat
[deps-url]: https://david-dm.org/rakuten-frontend/bower-browser
