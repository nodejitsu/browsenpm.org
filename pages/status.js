'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Page.extend({
  path: '/status',
  view: '../views/status.ejs',

  pagelets: base.pagelets.add({
    status: require('../pagelets/status'),
  })
}).on(module);