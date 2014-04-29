'use strict';

//
// Default navigation pagelet.
//
module.exports = require('../../contour').navigation.extend({
  data: {
    base: '',
    login: false,
    signup: false,
    navigation: [
      { name: 'Explore', href: '/' },
      // { name: 'Packages', href: '/packages/' },
      // { name: 'Authors', href: '/authors/' },
      { name: 'Node.js', href: 'http://nodejs.org', target: 'blank' },
      { name: 'Help', href: '/help/' },
    ]
  }
});