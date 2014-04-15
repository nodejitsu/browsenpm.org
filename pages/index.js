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
          { name: 'Recent', href: '/recent/' },
          { name: 'Packages', href: '/packages/' },
          { name: 'Authors', href: '/authors/' },
          { name: 'Help', href: '/help/' },
        ]
      }
    }),

    status: require('../pagelets/status')

    //footer: contour.footer
  }
}).on(module);