'use strict';

var GitHulk = require('githulk')
  , server = require('../index');

server.Page.extend({
  path: '/package/:name',
  view: '../views/package.ejs',

  pagelets: {
    package: require('packages-pagelet').extend({
      githulk: new GitHulk({ token: server.configuration.get('github') })
    })
  }
}).on(module);