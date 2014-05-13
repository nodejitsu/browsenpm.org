'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Page.extend({
  path: '/help/:category/:name',
  view: '../views/help.ejs',

  pagelets: base.pagelets.add({
    sidebar: require('npm-documentation-pagelet').sidebar,
    documentation: require('npm-documentation-pagelet')
  })
}).on(module);