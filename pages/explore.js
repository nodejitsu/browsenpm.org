'use strict';

var base = require('../base')
  , frameworks = require('../meta/frameworks')
  , testing = require('../meta/testing');

//
// Extend the default page.
//
base.Page.extend({
  path: '/explore/:name',
  view: '../views/explore.ejs',

  lists: [ 'frameworks', 'testing' ],

  pagelets: base.pagelets.add({
    frameworks: require('list-pagelet').extend(frameworks),
    testing: require('list-pagelet').extend(testing)
  }),

  initialize: function initialize() {
    var list = this.params.name;

    //
    // Show 404 if users requested to explore a list that does not exist.
    //
    if (!~this.lists.indexOf(name)) return this.notFound();

    //
    // Disable all pagelets but the requested list pagelet from the name param.
    //
    this.disabled = this.lists.filter(function filter(name) {
      return name !== list;
    });
  }
}).on(module);