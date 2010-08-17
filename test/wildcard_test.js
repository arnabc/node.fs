var sys = require('sys'),
    assert = require('assert'),
    Wildcard = require('./../lib/wildcard').Wildcard;


var f = [
    '/s/v/some.txt', '/f/d/s/d_dfd/ds-ff/www.png', 'chmod.txt', '../sdfs/dsf/pop.png', '/r/w/wert.txt', '/r/w/wert.txl'
];

console.log('Match .txt file names');
var wc = new Wildcard( '*.txt' );
var mp = f.filter( function ( m ) {
    return wc.match(m);
} );

console.log( mp );
assert.ok( mp.length == 3, '*.txt files match failed' );


console.log('Match .png file names');
wc = new Wildcard( '*.png' );
mp = f.filter( function ( m ) {
    return wc.match(m);
} );

console.log( mp );

assert.ok( mp.length == 2, '*.png files match failed' );

console.log('Match all files');
wc = new Wildcard( '*.*' );
mp = f.filter( function ( m ) {
    return wc.match(m);
} );

console.log( mp );

assert.equal( mp.length, 6, 'Should return all files, which must be 6' );


console.log('Match .tx files including both *.txt and *.txl')
wc = new Wildcard( '*.tx?' );
mp = f.filter( function ( m ) {
    return wc.match(m);
} );

console.log( mp );

assert.ok( mp.length == 4, '*.tx? files match failed' );