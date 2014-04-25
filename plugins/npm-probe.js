'use strict';

var pagelet = require('registry-status-pagelet')
  , nodejitsu = require('nodejitsu-app')
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
    Collector.probes.ping,
    Collector.probes.delta,
    Collector.probes.publish
  ]
});

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
    ping: async.apply(list, 'ping'),
    delta: async.apply(list, 'delta'),
    publish: async.apply(list, 'publish')
  }, function fetched(error, cache) {
    if (error) throw new Error(error.message ? error.message : JSON.stringify(error));
    var data = {}
      , latest = {};

    //
    // Listen to ping events and push data over websockets.
    //
    collector.on('item::ran', function ran(error, item) {
      if (error) return;

      var type = item.name
        , registry = item.registry
        , part = collector.clone(item);

      //
      // Add item results to cache and fetch data from the end of the cache.
      //
      cache[type][registry].push(item);

      //
      // Perform calculations and store in item results and local data.
      //
      part.results = collector.transform(type)(cache[type][registry].slice(-10)).pop();
      data[type][registry].push(part.results);

      //
      // Write the processed data to the all websocket connections.
      //
      pipe.primus.write(part);
    });

    //
    // Process the data for each data type and all reigstries seperatly.
    // The complete array is copied, so cache remains original.
    //
    for (var type in cache) {
      data[type] = data[type] || {};
      latest[type] = latest[type] || {};

      for (var registry in cache[type]) {
        data[type][registry] = collector.run(
          'transform',
          type,
          cache[type][registry].slice()
        );

        //
        // Add specific content for the most recent measurement.
        //
        latest[type][registry] = collector.run(
          'latest',
          type,
          data[type][registry],
          cache[type][registry]
        );
      }
    }

    //
    // Store all the data inside the pipe instance.
    //
    collector.data = data;
    collector.latest = latest;
  });

  //
  // Keep reference to the npm-probe instance inside BigPipe, errors will be
  // send to stderr.
  //
  pipe['npm-probe'] = collector;
  collector.on('error', console.error);
};

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