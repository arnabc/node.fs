
var fs   = require('fs'),
    Url  = require('url'),
    path = require('path'),
    http = require('http'),
    wc   = require('./wildcard');


module.exports = ( function () {

    function _read ( file, callback ) {
        // make sure the path exists
        path.exists( file, function ( exists ) {
            if( !exists ) throw Error( 'File "' + file + '" is missing.' );

            // read the content of the file
            fs.readFile( file, function ( err, buf ) {
                if( err ) throw err;

                callback( buf );
            } );
        } );
    }
    return {
        // reads a file and once the file reading is complete
        // it calls the specified callback
        read: _read,

        // reads a file and returns an array of lines split using \n
        readlines: function ( file, callback ) {
            _read( file, function ( buf ) {
                var data = buf instanceof Buffer
                            ? buf.toString('utf8')
                            : buf;

                // split the
                callback( data.split( /\n|\n\r/ ) );
            } );
        },

        fetch: function ( url, callback ) {
            var client, req = Url.parse( url ), httpReq;

            client = http.createClient( req.port || 80, req.host );
            httpReq = client.request( 'GET', req.pathname || '/', {
                host: req.host
            } );
            httpReq.end();

            httpReq.on( 'response', function ( response ) {
                var status = response.statusCode, content, buf, written = 0;
                // if it is an error then pass the callback method the parameters back and additionally
                // the HTTP status code
                if( status >= 400 && status < 500 )
                    return callback( url, status );

                var length = parseInt( response.headers['content-length'], 10 );

                if ( length ) {
                    buf = new Buffer( length );
                }

                response.on( 'data', function ( chunk ) {
                    chunk.copy( buf, written, 0, chunk.length );
                    written += chunk.length;
                } );

                // pass the buffer to callback
                response.on( 'end', function () {
                    console.log('Request complete: ', length, ' = ', buf.length );
                    if( callback ) callback( buf );
                } );
            } );
        },

        // method to find all the files specified by the pattern
        // in the specified directory path
        findAll: function ( dir, pattern, callback ) {
            // if no pattern is passed then assume all the files(*.*)
            if( arguments.length == 2 && typeof( pattern ) === 'function' ) {
                callback = pattern;
                pattern = '*.*'; 
            }
            
            fs.stats( dir, function ( err, stats ) {
                if( err ) throw err;

                if( !stats.isDirectory() ) throw Error( '[Error] The path has to be directory' );

                fs.readdir( dir, function ( err, files ) {
                    if( err ) throw err;

                    var op = files.filter( function ( v ) {
                                    return wc.match( v );
                                } ).map( function ( v ) {
                                    return path.normalize( dir + v );
                                } );

                    callback( op );
                } );
            } );
        }
    }
})();