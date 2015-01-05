'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Pagelet.extend({
  path: '/status',
  view: 'base.ejs',

  pagelets: base.pagelets.add({
    status: require('registry-status-pagelet').extend({
      //
      // Reference to the data collection of npm-probe.
      //
      get status() {
        var results = {}
          , pagelet = this
          , data = this._pipe['npm-probe'].data;

        for (var type in data) {
          results[type] = data[type] || {};

          for (var registry in data[type]) {
            results[type][registry] = data[type][registry].slice(
              data[type][registry].length - pagelet.options[type].n - 1
            );
          }
        }

        return results;
      },

      //
      // Reference to latest measurement data.
      //
      get latest() {
        return this._pipe['npm-probe'].latest || {};
      }
    })
  })
}).on(module);