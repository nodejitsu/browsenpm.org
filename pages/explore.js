'use strict';

var base = require('../base')
  , frameworks = require('../pagelets/meta/frameworks')
  , testing = require('../pagelets/meta/testing');

//
// Extend the default page.
//
base.Page.extend({
  path: '/explore/:name',
  view: '../views/explore.ejs',

  pagelets: base.pagelets.add({
    // add several pagelets lists (extend npm-list-pagelet).
    //"list-frameworks": require('npm-list-pagelet').extend(frameworks),
    //"list-testing": require('npm-list-pagelet').extend(testing)
  }),

  get: function get(render) {
    var explore = this;

    // enable certain list pagelet based on name param.
    Object.keys(this.pagelets).forEach(function (pagelet) {
      //explore.pagelets[pagelet].disable();
    });

    render();
  }
}).on(module);