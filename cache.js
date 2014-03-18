'use strict';

var fuse = require('fusing')
  , cradle = require('cradle')
  , redis = require('redis');

/**
 * Implementation of cache layer with basic get and set.
 *
 * @Constructor
 * @api public
 */
function Cache(options) {
  // TODO use options to determine caching layer (e.g. redis or couch)
}

fuse(Cache, require('events').EventEmitter);

/**
 * Get the key from cache.
 *
 * @param {String} key of cached value
 * @param {Function} done completion callback
 * @api public
 */
Cache.readable('get', function get(key, done) {
  // TODO implement.
});

/**
 * Store value with key in cache.
 *
 * @param {String} key of cached value
 * @param {Function} done completion callback
 * @api public
 */
Cache.readable('set', function set(key, value, done) {
 // TODO implement
});

/**
 * Remove the value from cache.
 *
 * @param {String} key delete the value from cache
 * @param {Function} done completion callback
 * @api public
 */
Cache.readable('del', function del(key, done) {
  // TODO implement
});

//
// Export our cache layer.
//
module.exports = Cache;