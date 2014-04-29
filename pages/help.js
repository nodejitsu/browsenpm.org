'use strict';

//
// Extend the default page.
//
require('../base').Page.extend({
  path: '/docs/:category/:name',  // HTTP route we should respond to.
  view: '../views/help.ejs',      // The base template we need to render.

  pagelets: {                     // The pagelets that should be rendered.
    navigation: require('../pagelets/navigation'),
    sidebar: require('npm-documentation-pagelet').sidebar,
    documentation: require('npm-documentation-pagelet')
  }
}).on(module);