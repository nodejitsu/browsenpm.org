'use strict';

var base = require('../base')
  , path = require('path');

//
// Extend the default page.
//
module.exports = base.Page.extend({
  path: '/',
  view: path.join(__dirname, '..', 'views/index.ejs'),

  //
  // Add style to explore title and subtitle.
  //
  dependencies: base.Page.prototype.dependencies.concat([
    path.join(__dirname, '..', 'assets/css/explore.styl')
  ]),

  pagelets: base.pagelets.add({
    search: require('npm-search-pagelet'),
    explore: require('../pagelets/explore')
  })
});