'use strict';

var sidebar = require('npm-documentation-pagelet').sidebar;

//
// Add some different styling to the sidebar to make it a table of contents.
//
module.exports = sidebar.extend({
  css: [
    sidebar.prototype.css,
    __dirname + '/toc.styl'
  ]
});