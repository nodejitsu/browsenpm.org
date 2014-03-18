'use strict';

var path = require('path')
  , BigPipe = require('bigpipe')
  , connect = require('connect')
  , configuration = require('./config')
  , debug = require('debug')('browsenpm:server');

//
// Setup all the configuration
//
var port = configuration.get('port');

//
// Initialise the BigPipe server.
//
var pipe = BigPipe.createServer(port, {
  pages: __dirname +'/pages',
  dist: __dirname +'/dist'
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
// Expose the server with references to
//
pipe.configuration = configuration;
module.exports = pipe;