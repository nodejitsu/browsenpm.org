'use strict';

var BigPipe = require('bigpipe')
  , contour = require('./contour')
  , npm = contour.get('npm');

/**
 * Define small collection of default pagelets, this prevents code duplication.
 *
 * @constructor
 * @api public
 */
function Pagelets() {
  this.navigation = require('./pagelets/navigation');
  this.footer = contour.footer.extend({ pagelets: {} });
  this.analytics = contour.analytics.extend({
    data: {
      domain: 'browsenpm.org',
      key: 'gikqh9ctxn',
      type: 'segment'
    }
  });
}

/**
 * Add pagelets to the collection.
 *
 * @param {Object} pagelets Collection of pagelets listed by name.
 * @returns {Pagelets} fluent interface
 * @api public
 */
Pagelets.prototype.add = function add(pagelets) {
  for (var name in pagelets) {
    this[name] = pagelets[name];
  }

  return this;
};

//
// Create a default page setup for browsenpm.org pages.
//
exports.Page = BigPipe.Page.extend({
  dependencies: [
    npm.normalize,
    npm.global,
    npm.grid,
    npm.icons,
    npm.typography,
    npm.animations,
    npm.tables
  ],
});

//
// Simple getter for exposing a fresh set of default pagelets.
//
Object.defineProperty(exports, 'pagelets', {
  enumerable: false,
  get: function pagelets() {
    return new Pagelets;
  }
});