'use strict';

//
// Extend the default page.
//
require('../base').Page.extend({
  path: '/500',
  view: '../views/500.ejs'
}).on(module);