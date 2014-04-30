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
    return this.pipe['npm-probe'].data || {};
  },

  //
  // Reference to latest measurement data.
  //
  get latest() {
    return this.pipe['npm-probe'].latest || {};
  }
});