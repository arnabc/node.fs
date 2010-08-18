var http = require('http'),
    sys = require('sys'),
    net = require('net'),
    Connect = require('connect'),
    globals = require('./globals'),
    server = Connect.server,
    log = console.log;


    // sample init method
    function init( port, hostname ) {
        // create the server instance
        server = http.createServer( Routing.dispatchRequest );
        // route all incoming request to the dispatcher
        server.listen( port, hostname );

        log('Server listing to http://%s:%d ....', hostname, port );
    }


    var port = process.argv[2],
        host = process.argv[3] || 'localhost';

    init( port, host );



