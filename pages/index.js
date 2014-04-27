'use strict';

var Page = require('bigpipe').Page
  , contour = require('../contour');

//
// Extend the default page.
//
Page.extend({
  path: '/',
  view: '../views/index.ejs',

  pagelets: {
    navigation: contour.navigation.extend({
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
    status: require('../pagelets/status'),
    search: require('npm-search-pagelet')
  }
}).on(module);
