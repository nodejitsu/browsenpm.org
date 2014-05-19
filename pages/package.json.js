'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Page.extend({
  path: '/package.json',
  view: '../views/package.json.ejs',

  pagelets: base.pagelets.add({
    'package.json': require('npm-package-json-pagelet')
  })
}).on(module);
