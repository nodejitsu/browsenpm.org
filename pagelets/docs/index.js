'use strict';

var base = require('../base')
  , contour = require('../contour')
  , npm = contour.get('npm');

//
// Extend the default page.
//
base.Pagelet.extend({
  path: '/help',
  view: './base.ejs',
  dependencies: base.Pagelet.prototype.dependencies.concat(npm.code),

  pagelets: base.pagelets.add({
    toc: require('../toc'),
  })
}).on(module);