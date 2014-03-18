'use strict';

var nconf = require('nconf')
  , fuse = require('fusing')
  , path = require('path');

/**
 * Simple configuration fetcher and updater, wraps around file constructor nconf.
 *
 * @constructor
 * @api private
 */
function Configuration() {
  this.conf = new nconf.File({ file: path.join(__dirname, 'config.json') });
  this.conf.loadSync();
}

//
// Allow the configuration to emit.
//
fuse(Configuration, require('events').EventEmitter);

//
// Set the current environment.
//
Configuration.readable('env', process.env.NODE_ENV || 'development');

/**
 * Retrieve a value from the configuration relative to the environment.
 *
 * @param {String} key
 * @returns {Mixed} stored value of key
 * @api public
 */
Configuration.readable('get', function get(key) {
  if (!(this.env in this.conf.store)) return;
  return this.conf.get.call(this.conf, this.env +':'+ key);
});

/**
 * Set a new configuration value relative to the environment.
 *
 * @param {String} key
 * @param {Mixed} value
 * @api private
 */
Configuration.readable('set', function set(key, value) {
  if (!(this.env in this.conf.store)) return;
  this.conf.set.call(this.conf, this.env +':'+ key, value);
});

//
// Expose configuration as singleton.
//
module.exports = new Configuration;