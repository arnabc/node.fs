var sys = require('sys'),
    assert = require('assert'),
    path = require('path'),
    Config = require('./../config/config'),
    dataUri = require('./../lib/data-uri');

console.log( 'START:: Data URI generation Testing\n' );
var p = path.join( Config.APP_ROOT, Config.CSS.ROOT, '/', 'style.css' );

console.log( 'CSS File to generate data:URIs ', p );

dataUri.generate( p ).then( function ( content ) {
    console.log( content );    
} );

console.log( '\nEND:: Data URI generation Testing' );