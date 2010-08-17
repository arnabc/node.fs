var sys = require('sys'),
    StringBuilder = require('./util').StringBuilder,
    fs = require('fs'),
    fsp = require('./fs-promise'),
    Config = require('./../config/config'),
    url = require('url'),
    global = require('./globals');


var MHTML_FILENAME = url.resolve( APP_PUBLIC, Config.CSS.MHTML.FILE ),
    processed = {}, position;

console.log( resolvePublicURL(MHTML_FILENAME) );
// create a MHTML file upfront we'll only append to that
var comment = '/*\n*/';
fs.writeFile( resolvePublicURL(MHTML_FILENAME), comment, function () {
    position = Buffer.byteLength( comment ) - 2;
});

function handleMHTML( filepath, content ) {
    var builder = new StringBuilder(), key, mhtmlStyle;
    
    // resolve the path to public folder
    filepath = url.resolve( APP_PUBLIC, filepath );

    // check we have already processed the file or not, if we did then just
    // return the processed string
    if( processed[ filepath ] ) return processed[ filepath ];

    // generate the unique base64 identifier that we'll be using as MHTML token
    key = _generateBase64Identifier( filepath );

    // add * hack background-image property for IE < 8
    builder.append( '*background-image:' )
           .append( 'url(mhtml:' )
           .append( MHTML_FILENAME + '!' + key )
           .append( ');' );

    mhtmlStyle = builder.toString();

    // store it in processed to avoid repeated processing of the same file
    processed[ filepath ] = mhtmlStyle;

    // add the new key to the generated text file
    _writeToMHTMLDocument( content, key );

    return mhtmlStyle;
}

exports.generate = handleMHTML;

function _generateBase64Identifier( uri ) {
    return new Buffer( uri ).toString('base64');
}


function _writeToMHTMLDocument( data, key ) {
    var builder = new StringBuilder(), sep = '__MHTML_BODY_SEPARATER__', path;

    builder.append( 'Content-Type: multipart/related; boundary="' + sep + '"' )
           .append( '--' + sep )
           .append( 'Content-Location:' + key )
           .append( 'Content-Transfer-Encoding:base64\n' )
           .append( data )
           .append( '\n' );

    // append to the file
    path = resolvePublicURL(MHTML_FILENAME);
    fs.open(path, 'w', undefined, function (err, fd) {
        fs.write(fd, builder.toString('\n'), position, undefined, function (err, written) {
            position += written;
            console.log('pos => ', position);
        });
    });
}

