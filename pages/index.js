'use strict';

//
// Extend the default page.
//
require('../base').Page.extend({
  path: '/',
  view: '../views/index.ejs',

  pagelets: {
    navigation: require('../pagelets/navigation'),
    status: require('../pagelets/status'),
    search: require('npm-search-pagelet'),
    footer: require('../contour').footer
  }
}).on(module);