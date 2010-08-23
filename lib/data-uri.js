var sys = require( 'sys' ),
    path = require( 'path' ),
    global = require('./globals'),
    promise = require( './../external/promise' ),
    defer = promise.defer,
    fs2 = require( 'fs' ),
    StringBuilder = require( './util' ).StringBuilder,
    fs = require( './readfile' ),
    Config = require('./../config/config'),
    mhtml = require('./mhtml');

function DataURIGenerator() {
    // mime types map
    var mimeTypes = {
        'png':  'image/png',
        'jpg':  'image/jpg',
        'jpeg': 'image/jpeg',
        'gif':  'image/gif'
    },

    removeQuoteRe = /'|"/g,
    httpRe = /^http:\/\//;

    // generates the full data:* URI prefix inc
    function generateDataURIPrefix( filename ) {
        var builder = new StringBuilder( getMimePrefix( filename ) ).append( ';base64,' );
        // if valid encoded string then go ahead
        return builder.toString();
    }

    /**
     * Method to get the data:mime-type prefix
     */
    function getMimePrefix( filename ) {
        var builder = new StringBuilder();

        builder.append( 'data:' )
            .append( mimeTypes[ getMimeType( filename ) ] );

        return builder.toString();
    }

    /**
     * Method to ge the mime type of the specified filename based on the extension
     * @param filename
     */
    function getMimeType( filename ) {
        // file type
        var type,
            dot = filename.lastIndexOf('.');

        if (dot && dot < filename.length) {
            type = filename.slice( dot + 1 );
        }

        return type.toLowerCase();
    }

    // utility method takes file path as parameter
    // converts all the background image URLs to base64
    // encoded images
    function generate( path ) {
        var def = defer();

        fs.readlines( path ).then( function ( lines ) {
            var builder = new StringBuilder();
            var mp = lines.map( function ( line, index ) {
                var p = new promise.Promise();
                parseBackgroundURL( line, index ).then( function ( data ) {
                    p.resolve( data );
                }, function () {
                    console.log( arguments[0] );
                    // on error return same
                    p.resolve( line );                    
                } );
                return p;
            } );

            promise.all( mp ).then( function ( data_arr ) {
                builder.append( data_arr );
                def.resolve( builder.toString() );

                // TODO IS this the place to create the MHTML document? 
            } );
        } );

        return def.promise;
    }


    // method reads the specified string for url(*...)
    // if it is there then it tries to extract the image
    // path and reads the content of the file
    function parseBackgroundURL( str, index ) {
        var pos = str.indexOf( 'url(' ), start,
            frag = 'url('.length,
            end, url, norm_image_path,
            b = new StringBuilder(),
            def = defer();

        // the line does not contain any background URLs
        if( pos === -1 ) {
            failure( str );
            return def.promise;
        }

        start = pos + frag;
        end = str.indexOf( ')', start );

        // if no end bracket is found then raise syntax error
        if( end < 0 ) throw Error( 'Invalid syntax at line number ' + index );

        url = str.substring( start, end );
        // remove trailing quotes if any
        url = url.replace( removeQuoteRe, '' );

        //  TODO check for already optimized Data URIs
        if( url.startsWith( 'data:' ) ) {
            failure( str );
            return def.promise;    
        }

        if( isRemoteURL( url ) ) {
            // handle remote Image URLs @TODO
        } else {
            // normalize URL
            norm_image_path = resolvePathToFilesystem( url );
            
            path.exists( norm_image_path, function ( exists ) {
                // file path invalid
                if( !exists ) return def.reject( 'No such file =>' + norm_image_path );

                // read the file information first ( synchronous )
                var stats = fs2.statSync( norm_image_path );

                // check for IE8
                if( if32KBplus( stats.size ) ) {
                    return failure( str );
                }

                // read the local file content
                fetchLocalImageContent( norm_image_path ).then( success );
            });
        }


        // on successful reading the content
        function success ( data ) {
            var encData;
            
            b.append( str.substring( 0, start ) );
            b.append( generateDataURIPrefix( url ) );
            
            encData = convertToBase64( data );
            b.append( encData );
            b.append( str.substring( end ) );

            // handle MHTML for IE < 8 browsers TODO or use different strategy
            if( Config.CSS.MHTML ) {
                var mhtmlstr = mhtml.generate( url, encData );
                b.append( mhtmlstr );
            }
            
            def.resolve( b.toString() );
        }


        //failure
        function failure ( str ) {
            // return as it is
            def.resolve( str );
        }

        return def.promise;
    }


    // fetches content of the local image files
    function fetchLocalImageContent( url ) {
        var def = defer();
                   
        fs.read( url, 'binary' ).then( function ( data ) {
            def.resolve( data );
        } );

        return def.promise;
    }

    // fetches content from Remote Location TODO
    function fetchRemoteImageContent() {

    }

    // boolean method determines whether the specified URL is a remote HTTP file or not
    function isRemoteURL( url ) {
        return httpRe.test( url );
    }

    // utility method converts the specified content in base64 encoded string
    function convertToBase64( content ) {
        var buf = content instanceof Buffer ? content : new Buffer( content );
        // convert the buffer to base64 string
        return buf.toString('base64', 0, buf.length );
    }

    // Method checks whether the specified buffer/string/number is greater than 32KB or not
    // IE8 has a known limitation, which does not allow embedding more than 32KB of data
    // using data:* URIs
    function if32KBplus( buf ) {
        var size = ( typeof buf === 'number' ) ? buf : buf.length;
        return size > 32768;
    }

    // expose the following methods outside
    exports.generate = generate;
    exports.convertToBase64 = convertToBase64;
}

DataURIGenerator();