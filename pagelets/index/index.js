'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Pagelet.extend({
  path: '/',
  view: './base.ejs',

  pagelets: base.pagelets.add({
    search: require('npm-search-pagelet')
  })
}).on(module);