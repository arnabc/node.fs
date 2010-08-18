// some globally accessible variables and methods

var sys = require('sys'),
    path = require('path'),
    url = require('url'),
    lang = require('./lang');

// GLOBAL CONSTANTS

// application root
FS_ROOT = path.normalize( path.dirname( __filename, '.js' ) + '/..' );

// public directory/document root
DOC_ROOT = FS_ROOT + '/public';

// resolves the specified URL(like an href) like a browser does
// also prefixes it with the DOC_ROOT to prevent '../../' tricks to
// read files one level up the document root
resolvePathToFilesystem = function ( u ) {
    // ../images => /images
    u = url.resolve( DOC_ROOT, u );
    
    return DOC_ROOT + u;
}