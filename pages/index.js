'use strict';

var Page = require('bigpipe').Page
  , nodejitsu = require('nodejitsu-app');

//
// Extend the default page.
//
Page.extend({
  path: '/',
  view: '../views/index.ejs',

  pagelets: {
    navigation: require('../contour').navigation.extend({
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

    //footer: require('../contour').footer
  }
}).on(module);