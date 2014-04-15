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

    cradle.view('results/ping', function query(error, results) {
      if (error) return done(error);

      status.ping = results;
      done(null, status);
    });
  }
});