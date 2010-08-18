var sys = require('sys'),
    StringBuilder = require('./util').StringBuilder,
    fs = require('fs'),
    Config = require('./../config/config'),
    url = require('url'),
    global = require('./globals'),


    MHTML_FILENAME = url.resolve( DOC_ROOT, Config.CSS.MHTML.FILE ),
    processed = {},
    builder = new StringBuilder( '/*' );

// export required methods outside
exports.generate = handleMHTML;
exports.createMHTMLDoc = createMHTMLDoc;


// method handles MHTML data generation, it also creates a CSS style rule
// targeted towards IE < 8 browsers using *hack
function handleMHTML( filepath, content ) {
    var sb = new StringBuilder(), key, mhtmlStyle;
    
    // resolve the path to public folder
    filepath = url.resolve( DOC_ROOT, filepath );

    // check we have already processed the file or not, if we did then just
    // return the processed string
    if( processed[ filepath ] ) return processed[ filepath ];

    // generate the unique base64 identifier that we'll be using as MHTML token
    key = _generateBase64Identifier( filepath );

    // add * hack background-image property for IE < 8
    sb.append( '*background-image:' )
            .append( 'url(mhtml:' )
            .append( MHTML_FILENAME + '!' + key )
            .append( ');' );

    mhtmlStyle = sb.toString();

    // store it in processed to avoid repeated processing of the same file
    processed[ filepath ] = mhtmlStyle;

    // add the new key to the generated text file
    _appendMHTMLHeaders( content, key );

    return mhtmlStyle;
}

// method takes image URL and converts(URL string not the content) to base64 encoded message
function _generateBase64Identifier( uri ) {
    return new Buffer( uri ).toString('base64');
}


// method creates an MHTML header block and appends it to the StringBuilder
function appendMHTMLHeaders( data, key ) {
    var sep = '__MHTML_BODY_SEPARATER__';

    if( builder.length == 0 ) builder.append( '/*' );

    builder.append( 'Content-Type: multipart/related; boundary="' + sep + '"' )
           .append( '--' + sep )
           .append( 'Content-Location:' + key )
           .append( 'Content-Transfer-Encoding:base64\n' )
           .append( data );
}


// method to create the MHTML document
function createMHTMLDoc() {
    // append to the file
    path = resolvePathToFilesystem( MHTML_FILENAME );
    // close the CSS comment
    builder.append( '*/' );
    
    fs.open( path, 'a', undefined, function (err, fd) {
        var data = builder.toString('\n');
        // flush the builder
        builder.clear();

        fs.write(fd, data, undefined, undefined, function (err, written) {
            fs.close( fd );
        });
    });
}

