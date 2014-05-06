'use strict';

//
// Extend the default page.
//
require('../base').Page.extend({
  path: '/help',                  // HTTP route we should respond to.
  view: '../views/docs.ejs',      // The base template we need to render.

  pagelets: {                     // The pagelets that should be rendered.
    navigation: require('../pagelets/navigation'),
    toc: require('../pagelets/toc'),
    footer: require('../contour').footer
  }
}).on(module);
