'use strict';

var base = require('../base')
  , data = require('../data');

//
// Extend the default page.
//
base.Page.extend({
  path: '/package/:name',
  view: '../views/package.ejs',

  pagelets: base.pagelets.add({
    package: require('packages-pagelet').extend({
      cache: data.redis,
      dependenciesPagelet: '/dependencies',
      registry: data.registry,
      githulk: data.githulk
    })
  })
}).on(module);