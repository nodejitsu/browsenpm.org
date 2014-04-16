'use strict';

var pagelet = require('registry-status-pagelet')
  , nodejitsu = require('nodejitsu-app')
  , Collector = require('npm-probe')
  , Dynamis = require('dynamis');

//
// Initialize our data collection instance and the CouchDB cache layer.
//
var couchdb = nodejitsu.config.get('couchdb')
  , cradle = new (require('cradle')).Connection(couchdb);

//
// Log any errors that are emitted from probes, these should not halt the process.
//
var collector = new Collector({
  error: console.error,
  npm: nodejitsu.config.get('npm'),
  cache: new Dynamis('cradle', cradle, couchdb),
  probes: [
    Collector.probes.ping,
    Collector.probes.delta,
    Collector.probes.publish
  ]
});

//
// Select the database in CouchDB so we can query the view directly.
//
cradle = cradle.database(couchdb.database);

//
// Extend the registry status pagelet.
//
module.exports = pagelet.extend({
  query: pagelet.prototype.query.concat('ping'),

  //
  // Use npm-probe as data collector/provider.
  //
  collector: collector,

  /**
   * Get all the data from CouchDB and add static data.
   *
   * @param {Function} done Completion callback.
   * @api public
   */
  get: function get(done) {
    var status = this;

    this.list(function list(error, cache) {
      if (error) return done(error);

      //
      // Calculate the moving average for the pings of each registry. Use 5 steps
      // which equals a duration of 15 minutes.
      //
      status.ping = {};
      for (var registry in cache) {
        status.ping[registry] = status.movingAverage(cache[registry], 5);
      }

      done(null, status);
    });
  },

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
  },

  /**
   * List data from a view specified by name.
   *
   * @param {String} view Optional name of the view in CouchDB, defaults to ping.
   * @param {Function} done Completion callback.
   * @api private
   */
  list: function list(view, done) {
    if ('function' !== typeof done) {
      done = view;
      view = 'ping';
    }

    cradle.list('results/byRegistry/' + view, done);
  }
});