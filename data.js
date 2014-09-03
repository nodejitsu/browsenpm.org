'use strict';

var major = require('./package.json').version.split('.').shift()
  , Registry = require('npm-registry')
  , GitHulk = require('githulk')
  , config = require('./config')
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
  this.cradle = new cradle.Connection(couchdb)
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
  this.githulk = new GitHulk({
    tokens: config.get('tokens'),
    cache: this.couch
  });

  this.registry = new Registry({
    registry: config.get('registry'),
    githulk: this.githulk
  });
}

/**
 * Get the latest version of a module.
 *
 * @param {String} name The name of the module.
 * @param {Function} fn The callback.
 * @returns {DataLayer}
 * @api public
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

  return this;
};

/**
 * Get all details of the latest module.
 *
 * @param {String} name The name of the module.
 * @param {Function} fn The callback.
 * @returns {DataLayer}
 * @api private
 */
DataLayer.prototype.getModule = function getModule(name, fn) {
  var layer = this;

  //
  // Check what the latest version of module is.
  //
  layer.latest(name, function latest(err, version) {
    if (err) return fn(err);

    name = layer.key(name, version);
    layer.redis.get(name, fn);
  });

  return this;
};

/**
 * Store data as latest version of module.
 *
 * @param {String} name The name of the module.
 * @param {Object} data Module details that should be stored.
 * @param {Function} fn The callback.
 * @returns {DataLayer}
 * @api public
 */
DataLayer.prototype.setModule = function setModule(name, data, fn) {
  var layer = this;

  //
  // Check what the latest version of module is.
  //
  layer.latest(name, function latest(err, version) {
    if (err) return fn(err);

    name = layer.key(name, version);
    layer.redis.set(name, data, 604800, fn);
  });

  return this;
}

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