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
  // Set of default titles that will be passed to data.
  //
  titles: {
    frameworks: 'MVC frameworks',
    testing: 'Testing and test runners'
  },

  //
  // Add list pagelets with different content to the page.
  //
  pagelets: base.pagelets.add({
    frameworks: require('../pagelets/list').extend(),
    testing: require('../pagelets/list').extend()
  }),

  /**
   * Disable pagelets by name parameter.
   *
   * @api public
   */
  initialize: function initialize() {
    var name = this.params.name
      , titles = this.titles
      , lists = Object.keys(titles);

    //
    // Show 404 if users requested to explore a list that does not exist.
    //
    if (!~lists.indexOf(name)) return this.notFound();

    //
    // Set the title for the page.
    //
    if (name in titles) this.data.title = titles[name];
  }
}).on(module);