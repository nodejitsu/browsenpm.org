'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Page.extend({
  path: '/',
  view: '../views/index.ejs',

  pagelets: base.pagelets.add({
    status: require('../pagelets/status'),
    search: require('npm-search-pagelet')
  })
}).on(module);