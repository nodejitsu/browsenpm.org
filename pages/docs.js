'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Page.extend({
  path: '/help',
  view: '../views/docs.ejs',

  pagelets: base.pagelets.add({
    toc: require('../pagelets/toc'),
  })
}).on(module);