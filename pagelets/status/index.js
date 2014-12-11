'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Pagelet.extend({
  path: '/status',
  view: 'base.ejs',

  pagelets: base.pagelets.add({
    status: require('../status'),
  })
}).on(module);