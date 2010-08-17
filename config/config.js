var path = require('path');

var Config = exports;

// CSS file combine and compress config
Config.CSS = {
    ROOT: '/css',
    
    COMBINE: true,
    COMPRESS: false,
    PATTERN: '*.css', // in future release @import will be supported
    FILE: 'style.min.css',

    // enable base64 encoding of images in CSS files
    BASE64: true,
    // MHTML configuration for IE, to make it work the 'BASE64' has
    // to be set as 'true'. To prevent MHTML option for IE set it as null/false
    MHTML: {
        FILE: '/mhtml-ie.xcss' 
    }
};


// ------------------- future release ----------------

// enable this only in production server
// during development the Node.fs always
// generates the Files whenever there is a change
Config.ENABLE_CACHING = false;


// JS combination configs
Config.JS = {
    COMBINE: true,
    COMPRESS: true,
    PATTERN: '*.js'
};

// freezing config to avoid accidental modification
//Object.freeze( exports );