'use strict';

//
// Extend the default page.
//
require('../base').Pagelet.extend({
  path: '/404',
  view: './base.ejs'
}).on(module);