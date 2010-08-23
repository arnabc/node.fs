require.paths.unshift('./../');

var connect = require('external/connect'),
    globals = require('./globals'),
    log = console.log;

// create a base and clean server
var server = module.exports = connect.createServer();

// enable logging for all requests
server.use('/', connect.logger() );

// create the stacks of modules
server.use('/',
    connect.responseTime(),
    connect.cacheManifest( DOC_ROOT, [ 'http://localhost:3000'] ),
    connect.conditionalGet(),
    connect.cache(),
    connect.gzip(),
    connect.staticProvider( DOC_ROOT )
);






