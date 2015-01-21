'use strict';

var contour = require('../contour')
  , npm = contour.get('npm');

//
// Extend the default page.
//
require('404-pagelet').extend({
  view: './base.ejs',
  pagelets: {
    navigation: require('../navigation'),
    footer: contour.footer,
    analytics: contour.analytics.extend({
      data: {
        domain: 'browsenpm.org',
        key: 'gikqh9ctxn',
        type: 'segment'
      }
    })
  },

  dependencies: [
    npm.normalize,
    npm.global,
    npm.grid,
    npm.icons,
    npm.typography,
    npm.animations,
    npm.tables
  ]
}).on(module);