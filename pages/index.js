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
      cache: new Dynamis('couchdb', cradle, couchdb)
    });

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

    status: require('registry-status-pagelet')

    //footer: contour.footer
  }
}).on(module);