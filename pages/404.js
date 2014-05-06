'use strict';

//
// Extend the default page.
//
require('../base').Page.extend({
  path: '/404',
  view: '../views/404.ejs'
}).on(module);