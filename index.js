'use strict';

var path = require('path')
  , BigPipe = require('bigpipe')
  , connect = require('connect')
  , memory = require('memory-producer')
  , debug = require('debug')('browsenpm:server')
  , config = require('./config');

//
// Setup all the configuration
//
var port = config.get('port')
  , service = config.get('service');

//
// Initialize plugins and add a valid path to base for plugin-layout.
//
var watch = require('bigpipe-watch')
  , layout = require('bigpipe-layout')
  , godot = require('bigpipe-godot')
  , probe = require('./plugins/npm-probe');

//
// Set base template and add default pagelets.
//
layout.options = {
  base: path.join(__dirname, 'views', 'base.ejs'),
};

//
// Initialise the BigPipe server.
//
var pipe = new BigPipe(require('http').createServer(), {
  pages: path.join(__dirname, 'pages'),
  dist: path.join(__dirname, 'dist'),
  plugins: [ probe, layout, watch , godot]
});

//
// Add some producers to the godot client if it exists
//
pipe.godot && pipe.godot.add(new Memory({ service: service }));

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
// Start listening when all data is properly prepared and fetched.
//
pipe.once('initialized', pipe.listen.bind(pipe, port));

//
// Expose the server.
//
module.exports = pipe;
