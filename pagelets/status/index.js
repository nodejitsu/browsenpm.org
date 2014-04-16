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
  },

  /**
   * Return pagelet itself to render, `query` will ensure only certain objects
   * get added. The CouchDB data is prefetched via a plugin.
   *
   * @param {Function} done Completion callback.
   * @api public
   */
  get: function get(done) {
    var status = this.status;

    for (var registry in status.ping) {
      status.ping[registry] = this.movingAverage(status.ping[registry], 5);
    }

    done(null, this);
  },

  /**
   * Calculate the moving average for the provided data with n steps.
   *
   * @param {Array} data Data collection of objects.
   * @param {Number} n Amount of steps.
   * @return {Array} Moving average per step.
   */
  movingAverage: function movingAverage(data, n) {
    return data.map(function map(probe, i, original) {
      var result = {}
        , k = i - n;

      if (k < 0) k = 0;
      while (++k < i) {
        for (var data in probe) {
          result[data] = result[data] || probe[data] / n;
          result[data] += original[k][data] / n;
        }
      }

      return result;
    });
  }
});