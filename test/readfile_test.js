var sys = require( 'sys' ),
    assert = require( 'assert' ),
    fs  = require( './../readfile' );


fs.files( './../styles', '*.*' ).then( function ( output ) {
    console.log( 'All files', output.join('| ') );
    assert.equal( output.length, 5, 'Should return all 5 files');
} );


fs.files( './../styles', '*.tx?' ).then( function ( output ) {
    console.log( 'Only text files', output.join('| ') );
    assert.equal( output.length, 2, 'Should return all 2 *.txt and *.txl files');
} );


fs.files( './../styles', '*.css' ).then( function ( output ) {
    console.log( 'Only css files', output.join('| ') );
    assert.equal( output.length, 3, 'Should return all 3 CSS files');
} );

// handle symlink
fs.files( './../bk', '*.backup' ).then( function ( output ) {
    console.log( 'Only backup files', output.join('| ') );
    assert.equal( output.length, 7, 'Should return all 7 .backup files');
} );


