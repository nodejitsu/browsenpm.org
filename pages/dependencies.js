'use strict';

var GitHulk = require('githulk')
  , Dynamis = require('dynamis')
  , Registry = require('npm-registry')
  , config = require('../config')
  , base = require('../base');

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

redis.on('error', function (err) {
  console.error(err);
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
base.Page.extend({
  path: '/dependencies/:name',
  view: '../views/dependencies.ejs',

  pagelets: base.pagelets.add({
    package: require('npm-dependencies-pagelet').extend({
      cache: new Dynamis('redis', redis, redisConf),
      registry: registry,
      githulk: githulk
    })
  })
}).on(module);