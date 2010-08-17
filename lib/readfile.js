/*
    File utility module which returns promises.

    Convenient methods:

    read(): - reads the entire contents of the specified file
    readlines(): - read the contents of the specified file by lines
    files(): - returns the list of files from the specified directory, filtered by specified wildcards( *.txt, *.cs? )
 */

var sys = require('sys'),
    fs  = require('./fs-promise'),
    defer = require( './promise' ).defer,
    Wildcard = require( './wildcard' ).Wildcard;


/**
 * Method takes a file path and optional encoding param, reads the content of the specified
 * file, it returns a promise which can be used to chain "then()" method calls
 * @param file
 */
function getContents( file ) {
    var deferred = defer();

    fs.readFile( file ).then( function ( buffer ) {
        deferred.resolve( buffer );
    },
    // this method gets executed if the supplied path is not proper
    function ( err ) {
        sys.error( err );
    } );

    return deferred.promise;
}
// read the contents of a file
exports.read = getContents;

/**
 * Method to read a files and returns lines of contents ( does not work for binary files )
 * @param path
 */
function readLines( path ) {
    var def = defer();

    getContents( path ).then( function ( buffer ) {
        var content = buffer instanceof Buffer ? buffer.toString('utf8', 0, buffer.length ) : buffer.toString(); 
        def.resolve( content.split( /\n|\n\r/ ) );
    } );

    return def.promise;
}
// export readlines method
exports.readlines = readLines;


// returns the list of files from the specified directory path,
// it also accepts an wildcard entry like "*.txt"
function files( path, type ) {
    var deferred = defer();

    // reads the directory of files
    fs.readdir( path ).then( function ( files ) {
        // filter the files list for specific type
        var filtered, wc = new Wildcard( type );
        filtered = files.filter( function ( file ) {
            return wc.match( file );
        } );

        deferred.resolve( filtered );
    },
    function ( err ) {
        sys.error( err );
    } );

    return deferred.promise;
}
// exports files method
exports.files = files;
