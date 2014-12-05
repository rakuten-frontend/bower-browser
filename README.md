# bower-browser (WIP)

> GUI tool for managing Bower components.

## Installation
```shell
$ npm install -g bower-browser
```

## Usage
```shell
$ cd path/to/your-project
$ bower-browser
```

Then, browser will open <http://localhost:3000> automatically.  
Manage your Bower components in the web GUI! :-)

### CLI Options
* `-p <number>`, `--port=<number>`  
  Specify the port number of bower-browser server.
  Default port is 3000.

* `-o <boolean>`, `--open=<boolean>`  
  Set false to prevent opening your browser at the start.
  If omit this or set true, browser will open the app automatically.

* `-h`, `--help`  
  Display command usage and exit.

* `-v`, `--version`  
  Display version and exit.

## API
```javascript
var BowerBrowser = require('bower-browser');

var app = new BowerBrowser({
  port: 8080,     // Port number. Default is 3000.
  open: false     // Prevent opening browser. Default is true. (Open automatically)
});

app
  .start()        // This will start the bower-browser server.
  .open();        // Open the app in your browser.
```

## License
Copyright (c) 2014 Rakuten, Inc. Licensed under the [MIT License](LICENSE).
