'use strict';

var Page = require('bigpipe').Page
  , Contour = require('contour')
  , npm = Contour.get('npm');

//
// Create a default page setup for browsenpm.org pages.
//
exports.Page = Page.extend({
  dependencies: [
    npm.normalize,
    npm.global,
    npm.grid,
    npm.icons,
    npm.typography,
    npm.animations,
    npm.tables
  ],

  pagelets: {
    navigation: require('./pagelets/navigation'),
    footer: require('./contour').footer
  }
});