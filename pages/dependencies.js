'use strict';

var GitHulk = require('githulk')
  , Dynamis = require('dynamis')
  , Page = require('../base').Page
  , Registry = require('npm-registry')
  , config = require('../config');

//
// Get configurations.
//
var couchdb = config.get('couchdb')
  , redisConf = config.get('redis');

//
// Initialize the cache persistance layers for both CouchDB and Redis.
//
var cradle = new (require('cradle')).Connection(couchdb)
  , redis = require('redis').createClient(
      redisConf.port,
      redisConf.host,
      { pass_auth: redisConf.auth }
    );

//
// Initialize GitHulk and provide a CouchDB cache layer.
//
var githulk = new GitHulk({
  cache: new Dynamis('cradle', cradle, couchdb),
  token: config.get('tokens')
});

//
// Initialize Registry.
//
var registry = new Registry({
  githulk: githulk,
  registry: config.get('registry')
});

//
// Extend the default page.
//
Page.extend({
  path: '/dependencies/:name',
  view: '../views/dependencies.ejs',

  pagelets: {
    navigation: require('../pagelets/navigation'),
    package: require('npm-dependencies-pagelet').extend({
      cache: new Dynamis('redis', redis, redisConf),
      registry: registry,
      githulk: githulk
    }),
    footer: require('../contour').footer
  }
}).on(module);
