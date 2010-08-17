// some globally accessible variables and methods

var sys = require('sys'),
    path = require('path'),
    url = require('url'),
    lang = require('./lang');

// GLOBAL CONSTANTS

// application root
APP_ROOT = path.normalize( path.dirname( __filename, '.js' ) + '/..' );

// public directory
APP_PUBLIC = APP_ROOT + '/public';

// resolves the specified URL based on the public root
resolvePublicURL = function ( u ) {
    u = url.resolve( APP_PUBLIC, u );
    
    return APP_PUBLIC + u;
}