'use strict';

var nodejitsu = require('nodejitsu-app')
  , Collector = require('npm-probe')
  , Dynamis = require('dynamis')
  , cradle = require('cradle')
  , async = require('async');

//
// Initialize our data collection instance and the CouchDB cache layer.
//
var couchdb = nodejitsu.config.get('couchdb')
  , couch = new cradle.Connection(couchdb);

//
// Create new npm-probe instance.
//
var collector = new Collector({
  npm: nodejitsu.config.get('npm'),
  cache: new Dynamis('cradle', couch, couchdb),
  probes: [
    Collector.probes.ping
    // Collector.probes.delta
    // Collector.probes.publish // Temporary silence cause npmjs.org is catching up.
  ]
});

/**
 * Calculate the moving average for the provided data with n steps.
 * Defaults to 5 steps.
 *
 * @param {Array} data Data collection of objects.
 * @param {Number} n Amount of steps.
 * @return {Array} Moving average per step.
 */
function movingAverage(data, n) {
  n = n || 5;

  return data.map(function map(probe, i, original) {
    var result = {}
      , k = i - n;

    while (++k < i) {
      for (var data in probe) {
        result[data] = result[data] || probe[data] / n;
        result[data] += original[k > 0 ? k : 0][data] / n;
      }
    }

    return result;
  });
}

/**
 * List data from a view specified by name.
 *
 * @param {String} view Optional name of the view in CouchDB, defaults to ping.
 * @param {Function} done Completion callback.
 * @api private
 */
function list(view, done) {
  if ('function' !== typeof done) {
    done = view;
    view = 'ping';
  }

  couch.database(couchdb.database).list('results/byRegistry/' + view, done);
}

//
// Method used for processing per data type.
//
// TODO: add methods for other data, e.g. delta and publish
//
var transform = {
  ping: movingAverage
};

//
// Plugin name.
//
exports.name = 'npm-probe';

/**
 * Server side plugin to prefetch cache and to connect primus to npm-probe
 * instance via listeners.
 *
 * TODO: prefetching cached data is async and potentially creates an ambigious state
 *
 * @param {Pipe} bigpipe instance
 * @param {Object} options
 * @api public
 */
exports.server = function server(pipe, options) {
  async.parallel({
    ping: async.apply(list, 'ping')
  }, function fetched(error, cache) {
    if (error) return;
    var data = {};

    //
    // Listen to ping events and push data over websockets.
    //
    collector.on('probe::ran', function ran(error, probe) {
      if (error) return;

      var type = probe.name
        , registry = probe.registry
        , part;

      //
      // Add probe results to cache and fetch data from the end of the cache.
      //
      cache[type][registry].push(probe.results);
      part = cache[type][registry].slice(-10);

      //
      // Perform calculations and store in probe results and local data.
      //
      probe.results = transform[type](part).pop();
      data[type][registry].push(probe.results);

      //
      // Write the processed data to the all websocket connections.
      //
      pipe.primus.write(probe);
    });

    //
    // Process the data for each data type and all reigstries seperatly.
    // The complete array is copied, so cache remains original.
    //
    for (var type in cache) {
      data[type] = data[type] || {};

      for (var registry in cache[type]) {
        data[type][registry] = transform[type](cache[type][registry].slice());
      }
    }

    //
    // Store all the data inside the pipe instance.
    //
    collector.data = data;
  });

  //
  // Keep reference to the npm-probe instance inside BigPipe, errors will be
  // send to stderr.
  //
  pipe['npm-probe'] = collector;
  collector.on('error', console.error);
};

//
// Export useful functions.
//
exports.movingAverage = movingAverage;
exports.list = list;