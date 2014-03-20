'use strict';

var GitHulk = require('githulk')
  , Page = require('bigpipe').Page
  , Registry = require('npm-registry')
  , nodejitsu = require('nodejitsu-app');

//
// Get nodejitsu-app configuration and caching layer.
//
var Cache = nodejitsu.cache
  , configuration = nodejitsu.config
  , couchdb = configuration.get('couchdb')
  , redisConf = configuration.get('redis');

//
// Initialize the cache persistance layers for both CouchDB and Redis.
//
var cradle = new (require('cradle')).Connection(couchdb)
  , redis = require('redis').createClient(redisConf.port, redisConf.host);

//
// Initialize GitHulk and provide a CouchDB cache layer.
//
var githulk = new GitHulk({
  cache: new Cache('cradle', cradle, couchdb),
  token: configuration.get('github')
});

//
// Initialize Registry.
//
var registry = new Registry({
  githulk: githulk,
  registry: configuration.get('registry')
});

//
// Extend the default page.
//
Page.extend({
  path: '/package/:name',
  view: '../views/package.ejs',

  pagelets: {
    navigation: require('../contour').navigation.extend({
      data: {
        base: '',
        login: false,
        signup: false,
        navigation: [
          { name: 'Recent', href: '/paas/' },
          { name: 'Packages', href: '/enterprise/' },
          { name: 'Authors', href: '/Authors/' },
          { name: 'Help', href: '/help/' },
        ]
      }
    }),

    package: require('packages-pagelet').extend({
      cache: new Cache('redis', redis, redisConf),
      githulk: githulk,
      registry: registry
    }),

    //footer: require('../contour').footer
  }
}).on(module);