'use strict';

var Page = require('bigpipe').Page;

Page.extend({
  path: '/docs/:category/:name',  // HTTP route we should respond to.
  view: '../views/help.ejs',      // The base template we need to render.
  pagelets: {                     // The pagelets that should be rendered.
    navigation: require('../contour').navigation.extend({
      data: {
        base: '',
        login: false,
        signup: false,
        navigation: [
          { name: 'Explore', href: '/' },
          // { name: 'Packages', href: '/packages/' },
          // { name: 'Authors', href: '/authors/' },
          { name: 'Node.js', href: 'http://nodejs.org', target: 'blank' },
          { name: 'Help', href: '/help/' }
        ]
      }
    }),
    sidebar: require('npm-documentation-pagelet').sidebar,
    documentation: require('npm-documentation-pagelet')
  }
}).on(module);
