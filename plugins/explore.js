'use strict';

var debug = require('diagnostics')('browsenpm:explore-plugin')
  , resolve = require('packages-pagelet').resolve
  , dataLayer = require('../data')
  , moment = require('moment')
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
    update(pipe.emits('plugin:init', exports.name));

    //
    // Update the data in LevelDB every 6 hours.
    //
    setInterval(function refresh() {
      update(pipe.emits('plugin:refresh', exports.name))
    }, 216E5);
  }
};

/**
 * Fetch and update the details of each package in the static lists.
 *
 * @param {Function} done Completion callback.
 * @api private
 */
function update(done) {
  var stack = {};

  //
  // Generate a stack of fetches that can be processed by async.parallel.
  //
  for (var key in list) {
    list[key].forEach(function each(name) {
      stack[key + '-' + name] = function prepare(next) {
        dataLayer.getModule(name, function cache(error, data) {
          if (!error && data) return next(null, data);

          //
          // Nothing found resolve the data structure.
          //
          resolve(name, {
            registry: dataLayer.registry,
            githulk: dataLayer.githulk
          }, function resolved(error, data) {
            if (error || !data) return next(error || new Error('Missing data'));
            dataLayer.setModule(name, data, next)
          });
        });
      };
    });
  }

  //
  // Execute the callstack, after write to LevelDB using a batch operation.
  //
  async.parallel(stack, function finished(error, data) {
    if (error) return done(error);

    var list = {}
      , type, name, github, pkg;

    //
    // Create a collection per module type and push each module as an
    // object on the list.
    //
    for (var key in data) {
      github = data[key].github || {};
      pkg = data[key].package || {};

      key = key.split('-');

      type = key[0];
      name = key[1];

      list[type] = list[type] || [];
      list[type].push({
        id: name,
        name: name,
        link: '/package/' + name,
        properties: {
          updated: moment(pkg.modified).format('LL'),
          watchers: github.watchers_count,
          maintainers: Object.keys(pkg.maintainers).length,
          stars: pkg.starred.length
        }
      });
    }

    //
    // Generate PUT operation for LevelDB.
    //
    var ops = Object.keys(list).map(function each(type) {
      return {
        type: 'put',
        key: type,
        value: JSON.stringify(list[type])
      }
    });

    //
    // Store the resolved registry and github data in LevelDB.
    //
    db.batch(ops, done);
  });
}