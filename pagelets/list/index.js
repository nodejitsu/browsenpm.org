'use strict';

var pagelet = require('list-pagelet');

//
// Make the list pagelet conditional based on the provided parameter.
//
module.exports = pagelet.extend({
  /**
   * Provide conditional layer. Only render/display the pagelet if the
   * parameter name equals the name of the list pagelet.
   *
   * @param {Request} req Page request.
   * @param {Function} next Completion callback.
   * @api private
   */
  if: function listAllowed(req, next) {
    next(this.name === this.params.name);
  },

  //
  // Temporary fix since BigPipe still binds events to pagelet names.
  //
  js: pagelet.prototype.js.concat(
    __dirname + '/client.js'
  ),

  /**
   * Fetch the data of the module from the LevelDB layer. The required data
   * is stored under the same key as the pagelet name.
   *
   * @param {Function} next Completion callback.
   * @api public
   */
  data: function data(next) {
    this.pipe.explore.get(this.name, function (error, data) {
      if (error) return next(error);

      try {
        next(null, JSON.parse(data));
      } catch(err) {
        next(err);
      }
    });
  }
});