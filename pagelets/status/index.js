'use strict';

var pagelet = require('registry-status-pagelet');

//
// Extend the registry status pagelet.
//
module.exports = pagelet.extend({

  //
  // Reference to the data collection of npm-probe.
  //
  get status() {
    var results = {}
      , pagelet = this
      , data = this.pipe['npm-probe'].data;

    for (var type in data) {
      results[type] = data[type] || {};

      for (var registry in data[type]) {
        results[type][registry] = data[type][registry].slice(
          pagelet.options[type].n
        );
      }
    }

    return results;
  },

  //
  // Reference to latest measurement data.
  //
  get latest() {
    return this.pipe['npm-probe'].latest || {};
  }
});