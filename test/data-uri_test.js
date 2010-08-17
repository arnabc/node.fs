var sys = require('sys'),
    assert = require('assert'),
    path = require('path'),
    Config = require('./../config/config'),
    dataUri = require('./../lib/data-uri'),
    global = require('./../lib/globals');

console.log( 'START:: Data URI generation Testing\n' );
var p = resolvePublicURL( Config.CSS.ROOT + '/style.css' );

console.log( 'CSS File to generate data:URIs ', p );

dataUri.generate( p ).then( function ( content ) {
    require('fs').writeFile( resolvePublicURL( Config.CSS.ROOT + '/' + Config.CSS.FILE ), content );
    assert.ok( content.indexOf( 'data:' ) > -1, 'Unable to convert images to base64 encoded data:URIs');
} );

console.log( '\nEND:: Data URI generation Testing' );