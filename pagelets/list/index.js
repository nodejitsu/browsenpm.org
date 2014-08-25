'use strict';

//
// Make the list pagelet conditional based on the provided parameter.
//
module.exports = require('list-pagelet').extend({
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
  }
});