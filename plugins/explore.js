'use strict';

var debug = require('diagnostics')('browsenpm:explore-plugin')
  , resolve = require('packages-pagelet').resolve
  , level = require('level')
  , async = require('async')
  , path = require('path')
  , db;

//
// List of frameworks per module type.
//
var list = {
  frameworks: require('../meta/frameworks'),
  testing: require('../meta/testing')
};

//
// Create LevelDB instance.
//
db = level(path.join(__dirname, 'explore.db'), {
  valueEncoding: 'utf-8'
});

//
// Plugin name.
//
exports.name = 'explore';

/**
 * [update description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function update(done) {
  var stack = {};

  //
  // Generate a stack of fetches that can be processed by async.parallel.
  //
  for (var key in list) {
    list[key].data.forEach(function each(module) {
      stack[key + '-' + module.package] = function prepare(next) {
        resolve(module.package, next);
      };
    });
  }

  async.parallel(stack, function (error, data) {
    console.log(data);
    done();
  });
}

/**
 * Server side plugin to fetch the latest data on the listed modules and refresh
 * cache each hour.
 *
 * @param {Pipe} bigpipe instance
 * @param {Object} options
 * @api public
 */
exports.server = function server(pipe, options) {
  pipe.explore = db;

  if (false !== options.update) {
    setInterval(function refresh() {
      update(pipe.emits('plugin:refresh', exports.name))
    }, 36E5);

    update(pipe.emits('plugin:init', exports.name));
  }
};