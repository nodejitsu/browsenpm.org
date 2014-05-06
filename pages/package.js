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
      { auth_pass: redisConf.auth }
    );

//
// Lets just log redis errors so we know what the fuck is going on
//
redis.on('error', function (err) {
  console.log(err);
});

//
// Initialize GitHulk and provide a CouchDB cache layer.
//
var githulk = new GitHulk({
  cache: new Dynamis('cradle', cradle, couchdb),
  tokens: config.get('tokens')
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
  path: '/package/:name',
  view: '../views/package.ejs',

  pagelets: {
    navigation: require('../pagelets/navigation'),
    package: require('packages-pagelet').extend({
      cache: new Dynamis('redis', redis, redisConf),
      dependenciesPagelet: '/dependencies',
      registry: registry,
      githulk: githulk
    }),

    footer: require('../contour').footer
  }
}).on(module);
