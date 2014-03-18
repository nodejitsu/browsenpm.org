'use strict';

var BigPipe = require('bigpipe')
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
  .before(connect.static(__dirname +'/public'))

pipe.on('error', function error(err) {
  console.error('Server received an error:'+ err.message, err.stack);
});

pipe.once('listening', function listening() {
  console.log('Browsenpm.org is now running on http://localhost:%d', port);
});

module.exports = pipe;