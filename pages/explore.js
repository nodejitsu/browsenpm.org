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

  //
  // Set of allowed list names.
  //
  lists: [ 'frameworks', 'testing' ],

  //
  // Add list pagelets with different content to the page.
  //
  pagelets: base.pagelets.add({
    frameworks: require('list-pagelet').extend(frameworks),
    testing: require('list-pagelet').extend(testing)
  }),

  /**
   * Disable pagelets by name parameter.
   *
   * @api public
   */
  initialize: function initialize() {
    var name = this.params.name;

    //
    // Show 404 if users requested to explore a list that does not exist.
    //
    if (!~this.lists.indexOf(name)) return this.notFound();

    //
    // Disable all pagelets but the requested list pagelet by name parameter.
    //
    this.disabled = this.lists.filter(function filter(list) {
      return name !== list;
    });
  }
}).on(module);