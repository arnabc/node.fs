var sys = require('sys'),
    path = require('path'),
    assert = require('assert'),
    Config = require('./../config/config'),
    combiner = require('./../lib/combine');

var dirpath = Config.APP_ROOT + Config.CSS.ROOT;

combiner.combine( dirpath, Config.CSS.PATTERN ).then( function ( arr ) {
    assert.equal( arr.length, 2, 'Total CSS files are 2, content returned ' + arr.length );   
} );
