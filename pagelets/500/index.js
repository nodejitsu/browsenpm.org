'use strict';

//
// Extend the default page.
//
require('../base').Pagelet.extend({
  path: '/500',
  view: './base.ejs'
}).on(module);