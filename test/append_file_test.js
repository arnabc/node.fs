var sys = require('sys'),
    assert = require('assert'),
    fs = require('fs');

var undef = undefined;

// open a file and write some data
function appendToFile ( v ) {
    fs.open( 'mylog.log', 'a', undef, function ( err, fd ) {
        if( err ) return sys.error(err);

        fs.fstat( fd, function(err, stats ) {
            if( err ) return sys.error(err);

            console.log( stats.size );

            fs.write( fd, 'Append' + v, undef, undef, function (err, written ) {
                if( err ) sys.error(err);

                console.log( 'Amount of data written =>', written );
                fs.close( fd );
            } )
        } );
    } );
}

[1, 24, 333].forEach( appendToFile );