'use strict';

var debug = require('diagnostics')('browsenpm:server')
  , Memory = require('memory-producer')
  , BigPipe = require('bigpipe')
  , connect = require('connect')
  , config = require('./config')
  , path = require('path');

//
// Setup all the configuration
//
var port = config.get('port')
  , service = config.get('service');

//
// Initialize plugins.
//
var watch = require('bigpipe-watch')
  , godot = require('bigpipe-godot')
  , probe = require('./plugins/npm-probe');

//
// Initialise the BigPipe server.
//
var pipe = new BigPipe(require('http').createServer(), {
  pagelets: path.join(__dirname, 'pagelets'),
  dist: path.join(__dirname, 'dist'),
  godot: config.get('godot'),
  plugins: [ probe, watch, godot ],
  transformer: 'sockjs'
});

//
// Add some producers to the godot client if it exists
//
if (pipe.godot) pipe.godot.add(new Memory({ service: service }));

//
// Add middleware.
//
pipe
  .middleware.before(connect.static(path.join(__dirname, 'public')))
  .middleware.before(connect.favicon(path.join(__dirname, 'public', 'favicon.png')));

//
// Listen for errors and the listen event.
//
pipe.on('error', function error(err) {
  console.error('Browsenpm.org received an error:'+ err.message, err.stack);
});

pipe.once('listening', function listening() {
  console.log('Browsenpm.org is now running on http://localhost:%d', port);
});

//
// Start listening when all data is properly prepared and fetched.
//
pipe.once('initialized', pipe.listen.bind(pipe, port));

//
// Expose the server.
//
module.exports = pipe;
