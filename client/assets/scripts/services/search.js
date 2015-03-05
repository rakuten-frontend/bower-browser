'use strict';

var _ = require('lodash');

var ignore = require('../values/ignore');
var whitelist = require('../values/whitelist');

var api = '/api/bower-component-list.json';

module.exports = [
  '$http',
  'SettingsService',
  function ($http, SettingsService) {

    var defaultParams = {
      query: '',
      page: 1,
      sorting: 'stars',
      order: 'desc'
    };
    var config = SettingsService.config;
    var packages = [];

    var service = {

      // Properties
      results: [],
      searching: false,
      loaded: false,
      loadingError: false,
      page: defaultParams.page,
      count: 0,
      pageCount: 1,
      from: 0,
      to: 0,
      limit: 20,
      sorting: defaultParams.sorting,
      order: defaultParams.order,
      query: defaultParams.query,

      // Set params and update results
      setParams: function (params) {
        var self = this;
        this.parseParams(params);
        if (!this.loaded) {
          this.fetchApi(api).success(function (data) {
            packages = data;
            self.loaded = true;
            self.search();
          });
        }
        else {
          this.search();
        }
      },

      // Parse params to set correct value
      parseParams: function (params) {
        this.query = params.q !== undefined ? String(params.q) : defaultParams.query;
        this.page = params.p !== undefined ? parseInt(params.p, 10) : defaultParams.page;
        switch (params.s) {
          case 'name':
          case 'owner':
          case 'stars':
          case 'updated':
            this.sorting = params.s;
            break;
          default:
            this.sorting = defaultParams.sorting;
        }
        switch (params.o) {
          case 'asc':
          case 'desc':
            this.order = params.o;
            break;
          default:
            this.order = defaultParams.order;
        }
      },

      // Get component list from API
      fetchApi: function (url) {
        var self = this;
        this.searching = true;
        this.loadingError = false;
        return $http.get(url)
          .success(function (res) {
            self.searching = false;
            return res.data;
          })
          .error(function () {
            self.searching = false;
            self.loadingError = true;
            return false;
          });
      },

      // Search packages
      search: function () {
        var matchedItems = packages;

        matchedItems = this.filter(matchedItems);
        matchedItems = this.find(matchedItems, this.query);
        matchedItems = this.sort(matchedItems, this.sorting, this.order);
        matchedItems = this.prioritize(matchedItems, this.query);

        this.count = matchedItems.length;
        this.pageCount = Math.ceil(this.count / this.limit);
        this.from = (this.page - 1) * this.limit + 1;
        this.to =  this.from + this.limit > this.count ? this.count : this.from + this.limit;
        this.results = matchedItems.slice(this.from - 1, this.to);
      },

      // Exclude ignoring/duplicated packages
      filter: function (items) {
        if (!config.ignoreDeprecatedPackages) {
          return items;
        }
        var list = _.filter(items, function (item) {
          // Ignore packages
          if (ignore.indexOf(item.name) !== -1) {
            return false;
          }
          // Limit to whitelisted packages
          if (whitelist[item.website] && item.name !== whitelist[item.website]) {
            return false;
          }
          return true;
        });
        // Dedupe packages
        list = _.uniq(list.reverse(), function (item) {
          return item.website;
        });
        return list;
      },

      // Find items by query
      find: function (items, query) {
        var self = this;
        if (query === '') {
          return items;
        }
        return _.filter(items, function (item) {
          if ((config.searchField.name && self.matchedInString(query, item.name)) ||
              (config.searchField.owner && self.matchedInString(query, item.owner)) ||
              (config.searchField.description && self.matchedInString(query, item.description)) ||
              (config.searchField.keyword && self.matchedInArray(query, item.keywords))) {
            return true;
          }
          return false;
        });
      },

      // Search in string field
      matchedInString: function (query, string) {
        if (typeof string !== 'string' || string === '') {
          return false;
        }
        return string.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      },

      // Search in array field
      matchedInArray: function (query, array) {
        if (!_.isArray(array) || array.length === 0) {
          return false;
        }
        return array.some(function (string) {
          return query.toLowerCase() === string.toLowerCase();
        });
      },

      // Sort items
      sort: function (items, sorting, order) {
        var list = _.sortBy(items, function (item) {
          return item[sorting];
        });
        if (order === 'desc') {
          list = list.reverse();
        }
        return list;
      },

      // Prioritize exact match
      prioritize: function (items, query) {
        if (!config.exactMatch || !config.searchField.name) {
          return items;
        }
        var list = items;
        var match = _.findIndex(list, function (item) {
          return query.toLowerCase() === item.name.toLowerCase();
        });
        if (match !== -1) {
          list.splice(0, 0, list.splice(match, 1)[0]);
        }
        return list;
      }

    };

    return service;

  }
];
