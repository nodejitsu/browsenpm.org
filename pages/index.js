'use strict';

var Cache = require('../cache')
  , server = require('../index')
  , GitHulk = require('githulk')
  , Page = require('bigpipe').Page
  , Registry = require('npm-registry')
  , configuration = require('nodejitsu-app').config;

//
// Initialize GitHulk and provide a CouchDB cache layer.
//
var githulk = new GitHulk({
  cache: new Cache(configuration.get('couchdb')),
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
    package: require('packages-pagelet').extend({
      cache: new Cache(configuration.get('redis')),
      githulk: githulk,
      registry: registry,
    })
  }
}).on(module);