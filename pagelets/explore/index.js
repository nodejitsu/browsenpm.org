'use strict';

var cascade = require('cascading-grid-pagelet')
  , async = require('async');

//
// Provide data to the Cascading Grid Pagelet.
//
module.exports = cascade.extend({
  blocks: [{
    type: 'frameworks',
    title: 'Web frameworks',
    sub: 'Popular Node.JS frameworks',
    link: '/explore/frameworks',
    height: 4,
    width: 7,
    hover: {
      modules: {
        caption: 'modules',
        icon: 'file'
      },
      contributors: {
        caption: 'contributors',
        icon: 'users'
      }
    }
  }, {
    type: 'testing',
    title: 'Testing',
    sub: 'Useful modules for test driven development',
    link: '/explore/testing',
    height: 4,
    width: 7,
    hover: {
      modules: {
        caption: 'modules',
        icon: 'file'
      },
      contributors: {
        caption: 'contributors',
        icon: 'users'
      }
    }
  }],

  /**
   * Called on GET, provide data to render blocks.
   *
   * @param {Function} render completion callback.
   * @api public
   */
  get: function get(render) {
    var grid = this;

    async.each(grid.blocks, function each(block, next) {
      grid.pipe.explore.get(block.type, {
        valueEncoding: 'json'
      }, function cache(error, data) {
        if (error || !data) return next(error || new Error('Missing explore data!'));

        //
        // Add the live counts to the data.
        //
        block.hover.modules.n = data.length;
        block.hover.contributors.n = data.reduce(function sum(n, module) {
          return n + module.properties.maintainers;
        }, 0);

        next();
      });
    }, function done(error) {
      if (error) return render(error);

      render(null, {
        blocks: grid.blocks.slice(0, grid.n),
        dimension: {
          height: grid.height,
          width: grid.width
        }
      });
    });
  }
});