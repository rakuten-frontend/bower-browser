'use strict';

var _ = require('lodash');

var ignore = require('../values/ignore');
var whitelist = require('../values/whitelist');

var api = '/api/bower-component-list.json';

module.exports = [
  '$http',
  function ($http) {

    var defaultParams = {
      query: '',
      page: 1,
      sorting: 'stars',
      order: 'desc'
    };

    var service = {

      // Properties
      components: [],
      list: [],
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
        var prev = {
          query: this.query,
          page: this.page,
          sorting: this.sorting,
          order: this.order
        };
        this.parseParams(params);
        if (!this.loaded) {
          this.loadComponents();
        }
        else if (this.query !== prev.query) {
          this.search();
        }
        else if (this.sorting !== prev.sorting || this.order !== prev.order) {
          this.sort();
        }
        else if (this.page !== prev.page) {
          this.pick();
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

      // Load component list
      loadComponents: function () {
        var self = this;
        this.searching = true;
        this.loadingError = false;
        this.fetchComponents().success(function (data) {
          self.components = data;
          self.list = self.components;
          self.loaded = true;
          self.search();
        });
      },

      // Get component list from API
      fetchComponents: function () {
        var self = this;
        return $http.get(api)
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

      // Search components using current condition
      search: function () {
        var query = this.query;
        var list = _.filter(this.components, function (item) {
          if (ignore.indexOf(item.name) !== -1) {
            return false;
          }
          if (_.isString(item.website) && typeof whitelist[item.website] !== 'undefined') {
            if (item.name !== whitelist[item.website]) {
              return false;
            }
          }
          if (query === '') {
            return true;
          }
          if (item.name.indexOf(query.toLowerCase()) !== -1 ||
              (item.description && item.description.indexOf(query.toLowerCase()) !== -1) ||
              item.owner.indexOf(query.toLowerCase()) !== -1) {
            return true;
          }
          return false;
        });
        this.list = list;
        this.count = this.list.length;
        this.pageCount = Math.ceil(this.count / this.limit);
        this.sort();
      },

      // Sort component list according to the current condition
      sort: function () {
        var self = this;
        var list = _.sortBy(this.list, function (item) {
          return item[self.sorting];
        });
        var match;

        if (this.order === 'desc') {
          list = list.reverse();
        }

        // Prioritize exact match
        match = _.findIndex(list, function (item) {
          return self.query.toLowerCase() === item.name.toLowerCase();
        });
        if (match !== -1) {
          list.splice(0, 0, list.splice(match, 1)[0]);
        }

        this.list = list;
        this.pick();
      },

      // Pick items to show
      pick: function () {
        var fromIndex = (this.page - 1) * this.limit;
        var toIndex = fromIndex + this.limit;
        this.results = this.list.slice(fromIndex, toIndex);
        this.from = fromIndex + 1;
        this.to = toIndex > this.count ? this.count : toIndex;
      }

    };

    return service;

  }
];
