var sys = require('sys'),
    fs  = require('./readfile'),
    Promise = require('./promise'),
    defer = Promise.defer,
    Config = require('./../config/config'),
    path = require('path');


// combines the files matched with the specified pattern from the
// specified directory
function combine( dirpath, pattern ) {
    var def = defer();
    
    // files based on the specified pattern and path
    fs.files( dirpath, pattern ).then(function ( files ) {
        return files.map( _promiseForFile.bind( this, dirpath ) );
    }).then(function ( pmap ) {
        Promise.all( pmap ).then(function ( data_arr ) {
            console.log( data_arr );
            def.resolve( data_arr );
        });
    });

    return def.promise;
}


// method takes a file name and reads the content of that file
// asynchronously
function _promiseForFile( dirpath, f ) {
    var def = defer();
    
    f = path.join( dirpath, '/', f );
    fs.read( f ).then(function ( data ) {
        def.resolve( data );
    }, function ( err ) {
        // log the error
        // but don't let error spoil the file reading stuffs
    } );

    return def.promise;
}

// export the method to outside
exports.combine = combine;
