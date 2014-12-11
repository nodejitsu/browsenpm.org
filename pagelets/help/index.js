'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Pagelet.extend({
  path: '/help/:category/:name',
  view: './base.ejs',

  pagelets: base.pagelets.add({
    sidebar: require('npm-documentation-pagelet').sidebar,
    documentation: require('npm-documentation-pagelet')
  })
}).on(module);