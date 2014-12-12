(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;

  var ignore = window.ignore;
  var whitelist = window.whitelist;

  // var api = 'https://bower-component-list.herokuapp.com/';
  var api = '/assets/api/bower-component-list.json';

  angular.module('bowerBrowser')
    .factory('SearchService', function ($http) {

      var defaultParams = {
        query: '',
        page: 1,
        sortField: 'stars',
        sortReverse: true
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
        limit: 30,
        sortField: defaultParams.sortField,
        sortReverse: defaultParams.sortReverse,
        query: defaultParams.query,

        // Set params and update results
        setParams: function (params) {
          var prev = {
            query: this.query,
            page: this.page,
            sortField: this.sortField,
            sortReverse: this.sortReverse
          };
          this.parseParams(params);
          if (!this.loaded) {
            this.loadComponents();
          }
          else if (this.query !== prev.query) {
            this.search();
          }
          else if (this.sortField !== prev.sortField || this.sortReverse !== prev.sortReverse) {
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
              this.sortField = params.s;
              break;
            default:
              this.sortField = defaultParams.sortField;
          }
          switch (params.r) {
            case '1':
              this.sortReverse = true;
              break;
            case '0':
              this.sortReverse = false;
              break;
            default:
              this.sortReverse = defaultParams.sortReverse;
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
            return item[self.sortField];
          });
          if (this.sortReverse) {
            list = list.reverse();
          }
          this.list = list;
          this.pick();
        },

        // Pick items to show
        pick: function () {
          var from = (this.page - 1) * this.limit;
          var to = from + this.limit;
          this.results = this.list.slice(from, to);
        }

      };

      return service;

    });

}(window));
