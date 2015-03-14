# Changelog

## 0.5.1 (2015-03-15)
- Support Node.js 0.12 and io.js.
- Show correct packages by improving dedupe function. (see: [bower/search #64](https://github.com/bower/search/pull/64))

## 0.5.0 (2015-03-12)
- Show keywords in search results. ([#6](https://github.com/rakuten-frontend/bower-browser/issues/6))
- Support `<field>:<query>` notation for search, e.g. `owner:twbs`, `keyword:responsive`.
- Notify update if available.
- [fix] Correct number of results per page.
- [fix] Prevent resetting page number when reloading.

## 0.4.2 (2015-03-09)
- Fix pagination bug.

## 0.4.1 (2015-03-06)
- Tweak search for compatibility with Bower official search.

## 0.4.0 (2015-03-05)
- Add "Settings" feature. ([#4](https://github.com/rakuten-frontend/bower-browser/issues/4))
- Add "Uninstall without save" to the package menu.
- Dedupe search results.
- Update dependencies.

## 0.3.1 (2015-02-24)
- Warn and exit when `bower` is not found.
- Warn and exit when running with root privileges.

## 0.3.0 (2015-02-23)
- Move cache file to OS's temp directory.
- Support `npm install` with `sudo` by removing `postinstall` script. ([#1](https://github.com/rakuten-frontend/bower-browser/issues/1))
- Optimize client source code.
- Fix stdout color.
- Fix icon animation on Firefox.
- Refactor client scripts using Browserify.
- Update dependencies.

## 0.2.0 (2015-01-27)
- Provide methods and events in API.
- Add `--silent` option.
- Fix bugs regarding file watcher.
- Test with Mocha.
- Update document.

## 0.1.0 (2015-01-15)
- First official release.
