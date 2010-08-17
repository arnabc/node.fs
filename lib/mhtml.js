var sys = require('sys'),
        StringBuilder = require('./lib/util').StringBuilder,
        fs = require('./node-promise/fs-promise');


var MHTML_FILENAME = './mhtml-hack.iecss';

function getMHTMLHack(data) {
    var builder = new StringBuilder(), key;
    // generate the unique base64 identifier that we'll be using as MHTML hack
    key = _generateBase64Identifier(data.url);

    // add * hack background-image property for IE < 8
    builder.append('*background-image:')
            .append('url(mhtml:')
            .append(MHTML_FILENAME + '!' + key)
            .append(')');

    console.log(builder);

    // add the new key to the generated text file
    writeToMHTMLDocument(data.content, key);
}

function _generateBase64Identifier(uri) {
    var buf = new Buffer(uri), _cache, _self = arguments.callee;

    _cache = _self.__cache || ( _self.__cache = {},_self.__cache );

    // if already present in the cache
    if (_cache[ uri ]) return _cache[ uri ];

    _cache[ uri ] = buf.toString('base64', 0, buf.length);

    return _cache[ uri ];
}


function writeToMHTMLDocument(data, key) {
    var builder = new StringBuilder(), sep = '__MHTML_BODY_SEPARATER__';

    builder.append('Content-Type: multipart/related; boundary="' + sep + '"')
            .append('--' + sep)
            .append('Content-Location:' + key)
            .append('Content-Transfer-Encoding:base64\n')
            .append(data);

    // append to the file
    fs.open(MHTML_FILENAME, 'w+').then(function (fd) {
        fs.write(fd, builder.toString('\n'), null);
    });
}


/*fs.readFile('./gmail.gif').then(function (content) {
    var str = content.toString('base64', 0, content.length);
    getMHTMLHack({ content: str, url: 'gmail.gif' })
});*/
