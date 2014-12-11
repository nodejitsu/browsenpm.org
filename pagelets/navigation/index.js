'use strict';

var contour = require('../contour')
  , pagelet = contour.navigation;

//
// Extend default navigation pagelet.
//
module.exports = pagelet.extend({
  view: __dirname + '/view.hbs',

  css: pagelet.prototype.css.concat([
    __dirname + '/label.styl',
    __dirname + '/social.styl'
  ]),

  //
  // Add social sharing pagelet.
  //
  pagelets: {
    share: contour.share.extend({
      data: {
        title: 'Browsenpm.org | Nodejitsu Inc.',
        domain: 'http://www.browsenpm.org',
        layout: 'horizontal right'
      }
    })
  },

  defaults: {
    base: '',
    loggedin: false,
    navigation: [
      { name: 'Explore', href: '/' },
      { name: 'Status', href: '/status' },
      { name: 'Node.js', href: 'http://nodejs.org', target: 'blank' },
      { name: 'Private npm', href: 'http://nodejitsu.com/try/private-npm', target: 'blank' },
      { name: 'package.json', href: '/package.json' },
      { name: 'Help', href: '/help' },
    ]
  }
});
