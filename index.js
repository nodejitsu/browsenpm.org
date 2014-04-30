'use strict';

var path = require('path')
  , BigPipe = require('bigpipe')
  , connect = require('connect')
  , debug = require('debug')('browsenpm:server')
  , config = require('./config');

//
// Setup all the configuration
//
var port = config.get('port');

//
// Initialize plugins and add a valid path to base for plugin-layout.
//
var watch = require('bigpipe-watch')
  , layout = require('bigpipe-layout')
  , probe = require('./plugins/npm-probe');

layout.options = { base: path.join(__dirname, 'views', 'base.ejs') };

//
// Initialise the BigPipe server.
//
var pipe = BigPipe.createServer(port, {
  pages: path.join(__dirname, 'pages'),
  dist: path.join(__dirname, 'dist'),
  plugins: [ probe, layout, watch ]
});

//
// Add middleware.
//
pipe
  .before(connect.static(path.join(__dirname, 'public')))
  .before(connect.favicon(path.join(__dirname, 'public', 'favicon.png')));

//
// Listen for errors and the listen event.
//
pipe.on('error', function error(err) {
  console.error('Server received an error:'+ err.message, err.stack);
});

pipe.once('listening', function listening() {
  console.log('Browsenpm.org is now running on http://localhost:%d', port);
});

//
// Expose the server.
//
module.exports = pipe;