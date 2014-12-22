'use strict';

var debug = require('diagnostics')('browsenpm:data')
  , Collector = require('npm-probe')
  , config = require('../config')
  , Dynamis = require('dynamis')
  , cradle = require('cradle')
  , async = require('async');

//
// Initialize our data collection instance and the CouchDB cache layer.
//
var couchdb = config.get('couchdb')
  , couch = new cradle.Connection(couchdb);

//
// Create new npm-probe instance.
//
var collector = new Collector({
  npm: config.get('npm'),
  cache: new Dynamis('cradle', couch, couchdb),
  probes: config.get('probes').map(function add(name) {
    return Collector.probes[name];
  })
});

//
// Plugin name.
//
exports.name = 'npm-probe';

/**
 * Server side plugin to prefetch cache and to connect primus to npm-probe
 * instance via listeners.
 *
 * @param {Pipe} bigpipe instance
 * @param {Object} options
 * @api public
 */
exports.server = function server(pipe, options) {
  prepare(function prepped(error) {
    if (error) return bailout(error);
    debug('Finished preparing CouchDB for data collection and querying');

    async.parallel({
      ping: async.apply(list, 'ping'),
      delta: async.apply(list, 'delta'),
      publish: async.apply(list, 'publish')
    }, function fetched(error, cache) {
      if (error) return bailout(error);
      debug('Fetched data for probes: %s', Object.keys(cache).join(', '));

      var data = {}
        , latest = {};

      //
      // Listen to ping events and push data over websockets.
      //
      collector.on('probe::ran', function ran(error, item) {
        if (error) return console.error(error);
        debug('Received %s data for %s ', item.name, item.registry);

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
        part.results = collector.run(
          'transform',
          type,
          cache[type][registry]
        ).pop();

        //
        // Let the probe return its decorated latest value.
        //
        data[type][registry].push(part.results);
        latest[type][registry] = collector.run(
          'latest',
          type,
          data[type][registry],
          cache[type][registry]
        );

        //
        // Write the processed data to the all websocket connections.
        //
        // pipe.primus.write({
        //   data: part,
        //   latest: latest[type][registry]
        // });
      });

      //
      // Process the data for each data type and all reigstries seperatly.
      // The complete array is copied, so cache remains original.
      //
      for (var type in cache) {
        data[type] = data[type] || {};
        latest[type] = latest[type] || {};

        for (var registry in cache[type]) {
          if (!cache[type][registry].length) {
            data[type][registry] = [];
            continue;
          }

          data[type][registry] = collector.run(
            'transform',
            type,
            cache[type][registry]
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
      // Store all the data inside the pipe instance. Clone the latest to prevent
      // circular data references.
      //
      collector.data = data;
      collector.latest = collector.clone(latest);

      debug('Finished transforming initial data');
      pipe.emit('initialized');
    });

    //
    // Keep reference to the npm-probe instance inside BigPipe, errors will be
    // send to stderr.
    //
    pipe['npm-probe'] = collector;
    collector.on('error', console.error);
  });
};

/**
 * Prepare CouchDB.
 *
 * @param {Function} done Completion callback
 * @api private
 */
function prepare(done) {
  var setup = require('./couchdb')
    , id = setup._id;

  /**
   * Check if design documents are present.
   *
   * @param {Error} error
   * @api private
   */
  function design(error) {
    if (error) return done(error);

    couch.get(id, function design(error, doc) {
      if (error && error.error === 'not_found') return couch.save(id, setup, done);
      if (error) return done(error);

      //
      // Check if the current design document is up to date.
      //
      delete doc._rev;
      if (JSON.stringify(doc) !== JSON.stringify(setup)) {
        debug('Preparing CouchDB with new design document');
        return couch.save(id, setup, done);
      }

      done(error);
    });
  }

  couch = couch.database(couchdb.database);
  couch.exists(function database(error, exists) {
    if (error) return done(error);

    //
    // Create the database if it does not exist otherwise continue.
    //
    if (!exists) return couch.create(design);
    design();
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
  var results = {};

  if ('function' !== typeof done) {
    done = view;
    view = 'ping';
  }

  async.each(Object.keys(collector.registries), function fetchEach(name, next) {
    debug('Listing data from CouchDB for %s of type %s', name, view);

    couch.list('results/byRegistry/' + view, {
      startkey: [name, []],
      descending: true,
      endkey: [name],
      limit: 2400
    }, function store(error, data) {
      if (error) return next(error);

      //
      // Add data in reversed order and only if probes are actively fetching
      // the data type. Data needs to be reversed due to the descending key.
      //
      if (~Collector.probes[view].list.indexOf(name)) {
        results[name] = (data[name] || []).reverse();
      }

      next();
    });
  }, function final(error) {
    if (error) return done(error);

    done(null, results);
  });
}

/**
 * Simple helper function to process error objects correctly. Cradle returns objects
 * in stead of proper Error objects.
 *
 * @param {Object|Error} error
 * @api private
 */
function bailout(error) {
  throw new Error(error.stack ? error.stack : JSON.stringify(error));
}
