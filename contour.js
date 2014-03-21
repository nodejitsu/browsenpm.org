'use strict';

var Contour = require('contour')
  , path = require('path');

//
// Expose singleton instance of Contour.
//
module.exports = new Contour(path.join(__dirname, 'views'), {
  store: path.join(path.join(__dirname, 'dist'), 'square.json'),
  output: path.resolve(__dirname, '../public'),
  brand: 'npm'
});