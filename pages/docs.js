'use strict';

var base = require('../base')
  , contour = require('./contour')
  , npm = contour.get('npm');
//
// Extend the default page.
//
base.Page.extend({
  path: '/help',
  view: '../views/docs.ejs',

  dependencies: [
    npm.get('code')
  ],

  pagelets: base.pagelets.add({
    toc: require('../pagelets/toc'),
  })
}).on(module);