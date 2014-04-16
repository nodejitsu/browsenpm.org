'use strict';

var pagelet = require('registry-status-pagelet')
  , nodejitsu = require('nodejitsu-app');

//
// Extend the registry status pagelet.
//
module.exports = pagelet.extend({
  //
  // Reference to the data collection of npm-probe.
  //
  get status() {
    return this.pipe['npm-probe'].data || {};
  }
});