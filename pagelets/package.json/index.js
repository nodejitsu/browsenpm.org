'use strict';

var base = require('../base');

//
// Extend the default page.
//
base.Pagelet.extend({
  path: '/package.json',
  view: './base.ejs',

  data: {
    title: 'package.json: an interactive guide - browsenpm.org'
  },

  pagelets: base.pagelets.add({
    'package.json-guide': require('npm-package-json-pagelet')
  })
}).on(module);
