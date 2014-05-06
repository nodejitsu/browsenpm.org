'use strict';

var pagelet = require('../../contour').navigation;

//
// Extend default navigation pagelet.
//
module.exports = pagelet.extend({
  view: __dirname + '/view.hbs',
  css: pagelet.prototype.css.concat(__dirname + '/label.styl'),
  data: {
    base: '',
    login: false,
    signup: false,
    navigation: [
      { name: 'Explore', href: '/' },
      // { name: 'Packages', href: '/packages/' },
      // { name: 'Authors', href: '/authors/' },
      { name: 'Node.js', href: 'http://nodejs.org', target: 'blank' },
      { name: 'Help', href: '/help' },
    ]
  }
});