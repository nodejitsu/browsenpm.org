'use strict';

var Page = require('bigpipe').Page
  , Dynamis = require('dynamis')
  , Collector = require('npm-probe')
  , contour = require('../contour')
  , nodejitsu = require('nodejitsu-app');

//
// Initialize our data collection instance and the CouchDB cache layer.
//
var couchdb = nodejitsu.config.get('couchdb')
  , cradle = new (require('cradle')).Connection(couchdb)
  , collector = new Collector({
      npm: nodejitsu.config.get('npm'),
      cache: new Dynamis('cradle', cradle, couchdb),
      probes: [
        Collector.probes.ping,
        Collector.probes.delta,
        Collector.probes.publish
      ]
    });

//
// Log any errors that are emitted from probes, these should not halt the process.
//
collector.on('probe::error', console.error);
cradle = cradle.database(couchdb.database);
//
// Extend the default page.
//
Page.extend({
  path: '/',
  view: '../views/index.ejs',

  pagelets: {
    navigation: contour.navigation.extend({
      data: {
        base: '',
        login: false,
        signup: false,
        navigation: [
          { name: 'Recent', href: '/recent/' },
          { name: 'Packages', href: '/packages/' },
          { name: 'Authors', href: '/authors/' },
          { name: 'Help', href: '/help/' },
        ]
      }
    }),

    status: require('registry-status-pagelet').extend({
      //
      // Add ping to the query.
      //
      query: require('registry-status-pagelet').prototype.query.concat('ping'),

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
    })

    //footer: contour.footer
  }
}).on(module);