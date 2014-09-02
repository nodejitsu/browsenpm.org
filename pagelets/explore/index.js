'use strict';

var cascade = require('cascading-grid-pagelet')
  , frameworks = require('../../meta/frameworks')
  , testing = require('../../meta/testing');

//
// Provide data to the Cascading Grid Pagelet.
//
module.exports = cascade.extend({
  blocks: [{
    title: 'Web frameworks',
    sub: 'Popular Node.JS frameworks',
    link: '/explore/frameworks',
    height: 4,
    width: 7,
    hover: [
      {
        caption: 'modules',
        icon: 'file',
        n: frameworks.length
      },
      {
        caption: 'contributors',
        icon: 'users',
        n: 12 // TODO: Calculate number from module/CouchDB data
      }
    ]
  }, {
    title: 'Testing',
    sub: 'Useful modules for test driven development',
    link: '/explore/testing',
    height: 4,
    width: 7,
    hover: [
      {
        caption: 'modules',
        icon: 'file',
        n: testing.length
      },
      {
        caption: 'contributors',
        icon: 'users',
        n: 12 // TODO: Calculate number from module/CouchDB data
      }
    ]
  }]
});