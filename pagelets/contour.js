'use strict';

var Contour = require('contour')
  , path = require('path');

//
// Expose singleton instance of Contour.
//
module.exports = new Contour({
  pipe: require('../'),
  brand: 'npm'
});
