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
        var parsed = this.parseQuery(this.query);
        var query = parsed.query;
        var fields = parsed.field ? [parsed.field] :
          _.filter(Object.keys(config.searchField), function (key) {
            return config.searchField[key];
          });
        var exact = !!parsed.field;

        matchedItems = this.filter(matchedItems);
        matchedItems = this.find(matchedItems, query, fields, exact);
        matchedItems = this.dedupe(matchedItems);
        matchedItems = this.sort(matchedItems, this.sorting, this.order);
        matchedItems = !exact ? this.prioritize(matchedItems, query) : matchedItems;

        this.count = matchedItems.length;
        this.pageCount = Math.ceil(this.count / this.limit);
        this.from = (this.page - 1) * this.limit + 1;
        this.to =  this.from + this.limit - 1 > this.count ? this.count : this.from + this.limit - 1;
        this.results = matchedItems.slice(this.from - 1, this.to);
      },

      // Parse query string to {query,field} object
      parseQuery: function (query) {
        var fieldList = ['name', 'owner', 'description', 'keyword'];
        var parsedField = _.find(fieldList, function (field) {
          return query.indexOf(field + ':') === 0;
        });
        var parsedQuery = parsedField ? query.replace(new RegExp('^' + parsedField + ':'), '') : query;
        return {query: parsedQuery, field: parsedField};
      },

      // Exclude ignoring packages
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
        return list;
      },

      // Dedupe packages
      dedupe: function (items) {
        if (!config.ignoreDeprecatedPackages) {
          return items;
        }
        var groupedResults = _.groupBy(items.reverse(), function (item) {
          return item.website;
        });
        var list = [];
        _.forEach(groupedResults, function (group) {
          var matchedItem;
          if (group.length > 1) {
            var repoName = group[0].website.split('/').pop();
            matchedItem = _.find(group, function (item) {
              return item.name === repoName;
            });
          }
          if (!matchedItem) {
            matchedItem = group[0];
          }
          list.push(matchedItem);
        });
        return list;
      },

      // Find items by query
      find: function (items, query, fields, exact) {
        var self = this;
        var isTarget = function (fieldName) {
          return fields.indexOf(fieldName) !== -1;
        };
        if (query === '') {
          return items;
        }
        fields = fields || ['name', 'owner', 'description', 'keyword'];
        return _.filter(items, function (item) {
          if ((isTarget('name') && self.matchedInString(query, item.name, exact)) ||
              (isTarget('owner') && self.matchedInString(query, item.owner, exact)) ||
              (isTarget('description') && self.matchedInString(query, item.description, exact)) ||
              (isTarget('keyword') && self.matchedInArray(query, item.keywords, exact))) {
            return true;
          }
          return false;
        });
      },

      // Search in string field
      matchedInString: function (query, string, exact) {
        if (typeof string !== 'string' || string === '') {
          return false;
        }
        if (exact) {
          return string.toLowerCase() === query.toLowerCase();
        }
        return string.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      },

      // Search in array field
      matchedInArray: function (query, array, exact) {
        if (!_.isArray(array) || array.length === 0) {
          return false;
        }
        return array.some(function (string) {
          if (exact) {
            return query.toLowerCase() === string.toLowerCase();
          }
          return string.toLowerCase().indexOf(query.toLowerCase()) !== -1;
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
