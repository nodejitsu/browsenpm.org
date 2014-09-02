'use strict';

var Registry = require('npm-registry')
  , config = require('../config')
  , Dynamis = require('dynamis')
  , cradle = require('cradle')
  , redis = require('redis');

//
// Get configurations.
//
var couchdb = config.get('couchdb')
  , redisConf = config.get('redis');

/**
 * Initialize the cache persistance layers for both CouchDB and Redis.
 * The Constructor is exposed as singleton.
 *
 * @Constructor
 * @api public
 */
function DataLayer() {
  //
  // Initialize clients for Redis and CouchDB.
  //
  this.cradle = (new cradle).Connection(couchdb)
  this.client = redis.createClient(redisConf.port, redisConf.host, {
    auth_pass: redisConf.auth
  });

  //
  // Add simple dynamis API on top of Redis and CouchDB.
  //
  this.redis = new Dynamis('redis', this.client, redisConf);
  this.couch = new Dynamis('cradle', this.cradle, couchdb);

  //
  // Lets just log redis errors so we know what the fuck is going on.
  //
  this.redis.on('error', function (err) {
    console.error(err);
  });

  //
  // Initialize GitHulk and npm registry API.
  //
  this.registry = new Registry({ registry: config.get('registry') });
  this.githulk = new GitHulk({
    cache: this.couch
    tokens: config.get('tokens')
  });
}

/**
 * Get the latest version of a module.
 *
 * @param {String} name The name of the module.
 * @param {Function} fn The callback.
 * @api private
 */
DataLayer.prototype.latest = function latest(name, fn) {
  var key = this.key(name, 'latest')
    , layer = this;

  layer.redis.get(key, function cached(err, data) {
    if (!err && data) return fn(err, data);

    layer.registry.packages.get(name +'/latest', function latest(err, data) {
      if (err) return fn(err);

      if (Array.isArray(data)) data = data[0];
      layer.redis.set(key, data.version, 3600);

      fn(undefined, data.version);
    });
  });
};

/**
 * Get all details of the latest module.
 *
 * @param {String} name The name of the module.
 * @param {Function} fn The callback.
 * @api private
 */
DataLayer.prototype.get = function get(name, fn) {
  var layer = this;

  //
  // Check what the latest version of module is.
  //
  layer.latest(name, function latest(err, version) {
    if (err) return next(err);

    key = layer.key(name, version);
    layer.redis.get(key, function cached(err, data) {
      if (!err && data) return next(null, data);

      //
      // No data or an error, resolve the data structure.
      //
      layer.resolve(name, {
        registry: layer.registry,
        githulk: layer.githulk
      }, function resolved(err, data) {
        if (err || !data) fn(new Error('Missing data, resolving failed'));

        //
        // Do non-deterministic save, should it fail the next request would retry.
        //
        layer.redis.set(key, data, 604800);
        fn(null, data);
      });
    });
  });
};

/**
 * Return the cache key for a given module. By default we are prefixing the
 * names with the major version number of this module. As we want to be able
 * to change the structure of the data without creating potential cache
 * conflicts. In addition to that this prevent potential dictionary attacks
 * where people use __proto__ as package name.
 *
 * @param {String} name The name of the module.
 * @param {String} version The version number of the module.
 * @returns {String} The cache key.
 * @api public
 */
DataLayer.prototype.key = function key(name, version) {
  return 'v'+ major +':'+ name +'@'+ version;
};

//
// Expose the DataLayer as singleton instance.
//
module.exports = new DataLayer;