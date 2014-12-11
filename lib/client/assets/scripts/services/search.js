(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;

  var ignore = window.ignore;
  var whitelist = window.whitelist;

  var api = 'https://bower-component-list.herokuapp.com/';

  angular.module('bowerBrowser')
    .factory('SearchService', function ($http) {

      var service = {

        // Properties
        components: [],
        list: [],
        results: [],
        searching: false,
        loaded: false,
        loadingError: false,
        page: 1,
        count: 0,
        pageCount: 1,
        limit: 30,
        sortField: 'stars',
        sortReverse: true,
        query: '',

        // Load component list
        loadComponents: function () {
          var self = this;
          this.searching = true;
          this.loadingError = false;
          this.getComponents().success(function (data) {
            self.components = data;
            self.list = self.components;
            self.loaded = true;
            self.search();
          });
        },

        // Reset list to the default setting
        resetResults: function () {
          this.sortField = 'stars';
          this.sortReverse = true;
          this.query = '';
          this.search();
        },

        // Get component list from API
        getComponents: function () {
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

        // Update results to show
        updateResults: function () {
          var from = (this.page - 1) * this.limit;
          var to = from + this.limit;
          this.results = this.list.slice(from, to);
        },

        // Got to previous page
        goPrev: function () {
          if (this.hasPrev()) {
            this.page--;
            this.updateResults();
          }
        },

        // Go to next page
        goNext: function () {
          if (this.hasNext()) {
            this.page++;
            this.updateResults();
          }
        },

        // Has previous page or not
        hasPrev: function () {
          return this.page > 1;
        },

        // Has next page or not
        hasNext: function () {
          return this.page < this.pageCount;
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
        },

        // Sort component list by field
        sortBy: function (field) {
          if (field === this.sortField) {
            this.sortReverse = !this.sortReverse;
          }
          else {
            this.sortField = field;
            this.sortReverse = false;
          }
          this.sort();
          this.updateResults();
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
          this.page = 1;
          this.count = this.list.length;
          this.pageCount = Math.ceil(this.count / this.limit);
          this.sort();
          this.updateResults();
        }

      };

      return service;

    });

}(window));
